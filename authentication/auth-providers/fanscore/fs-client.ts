import { injectable } from 'inversify';
import qs from 'qs';
import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import Cookies, { CookieAttributes } from 'js-cookie';
import {
    FSErrorResponse,
    FSLoginOrRegisterResponse,
} from 'fanx-ui-framework/general/services/authentication/auth-providers/fanscore/interfaces';
import { appConfig } from 'configuration/app-config';
import { deviceId } from 'fanx-ui-framework/general/services/authentication/auth-providers/fanscore/deviceId';
import { accountConfig } from 'configuration/account-config';
import { IGeneralFormResponse } from 'fanx-ui-framework/general/interfaces/form-interfaces';
import {
    logoutEvent,
    tokenUpdate,
} from 'fanx-ui-framework/general/services/authentication/auth-store';
import { IBearerApi } from 'fanx-ui-framework/general/services/authentication/interfaces';

let jwtToken: string | null =
    (process.browser && Cookies.get(accountConfig.authStorageTokenKey)) || null;
let jwtRefreshToken: string | null =
    (process.browser && Cookies.get(accountConfig.authStorageRefreshKey)) || null;

if (jwtToken) tokenUpdate(jwtToken);

export const fsApi = axios.create({
    headers: { 'Content-Type': 'application/json' },
});

const isFsError = (err: AxiosError<any>): err is AxiosError<FSErrorResponse> =>
    !!err.response?.data;

const isTokenResponse = (r: any): r is FSLoginOrRegisterResponse =>
    r.config.url === appConfig.ssoEndpoints.token ||
    r.config.url === appConfig.ssoEndpoints.socialLogin;

const cleanTokens = (): IGeneralFormResponse => {
    jwtToken = null;
    jwtRefreshToken = null;
    Cookies.remove(accountConfig.authStorageTokenKey, {
        domain: window.location.hostname.replace('www', ''),
    });
    Cookies.remove(accountConfig.authStorageRefreshKey);
    return { success: true };
};

export const logoutPromise = (): Promise<IGeneralFormResponse> =>
    fsApi.delete(appConfig.ssoEndpoints.logout).then(cleanTokens).catch(cleanTokens);

logoutEvent.watch(() => {
    if (jwtToken) logoutPromise();
});

const setCookie = (key: string, token: string, expiresIn: number, domainSupport?: boolean) => {
    const options: CookieAttributes = {
        sameSite: 'Lax',
        expires: new Date(+new Date() + expiresIn),
    };

    if (domainSupport) options.domain = window.location.hostname.replace('www', '');

    Cookies.set(key, token, options);
};

export const updateTokens = ({
    access_token,
    refresh_token,
    expires_in,
}: FSLoginOrRegisterResponse): void => {
    jwtToken = access_token;
    jwtRefreshToken = refresh_token;
    tokenUpdate(access_token);
    setCookie(accountConfig.authStorageTokenKey, access_token, expires_in * 1000, true);
    setCookie(
        accountConfig.authStorageRefreshKey,
        refresh_token,
        accountConfig.refreshTokenExpiresInDays * 60 * 60 * 24 * 1000
    );
};

export const fsFormEncodedApi = axios.create({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

let refreshRequest: Promise<IGeneralFormResponse> | null = null;

fsFormEncodedApi.interceptors.response.use(
    (r: AxiosResponse) => {
        if (isTokenResponse(r)) updateTokens(r.data);
        return r;
    },
    (e) => Promise.reject(e)
);

const getRefreshPromise = (): Promise<IGeneralFormResponse> => {
    if (!refreshRequest)
        refreshRequest = fsFormEncodedApi
            .post<FSLoginOrRegisterResponse>(
                appConfig.ssoEndpoints.token,
                qs.stringify({
                    grant_type: 'refresh_token',
                    client_id: appConfig.fanscore.clientId,
                    device_id: deviceId,
                    refresh_token: jwtRefreshToken ?? null,
                })
            )
            .then(
                ({ data }): IGeneralFormResponse => {
                    updateTokens(data);
                    return { success: true };
                }
            )
            .catch(({ message }: AxiosError) => {
                logoutEvent();
                return { success: false, message };
            })
            .finally(() => {
                refreshRequest = null;
            });
    return refreshRequest;
};

const useRefreshAndTryOneMoreTime = (config: AxiosRequestConfig): Promise<any> =>
    getRefreshPromise().then(() => fsApi({ ...config, ...{ retry: true } }));

fsApi.interceptors.request.use(async (config) => {
    if (process.browser) {
        const isItFresh = !!Cookies.get(accountConfig.authStorageTokenKey);
        if (!isItFresh && jwtRefreshToken) await getRefreshPromise();
        if (jwtToken && config.url === appConfig.ssoEndpoints.streamAmgPayments) {
            config.params = {};
            config.params.apijwttoken = jwtToken;
        }
        if (jwtToken && config.url !== appConfig.ssoEndpoints.streamAmgPayments) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
        if (
            !jwtToken &&
            (config.url === appConfig.ssoEndpoints.token ||
                config.url === appConfig.ssoEndpoints.profile)
        )
            throw { message: 'here is no tokens' };
    }
    return config;
});

const isSocialLogin = (r: any): r is FSLoginOrRegisterResponse =>
    r.config.url === appConfig.ssoEndpoints.socialLogin;

const isUpdateProfileOrEmail = (r: AxiosResponse): boolean =>
    (r.config.url === appConfig.ssoEndpoints.profile && r.config.method === 'patch') ||
    (r.config.url === appConfig.ssoEndpoints.changeEmail && r.config.method === 'post');

fsApi.interceptors.response.use(
    (r: AxiosResponse) => {
        if (isSocialLogin(r)) updateTokens(r.data.data);
        if (isUpdateProfileOrEmail(r)) return getRefreshPromise().then(() => r);
        return r;
    },
    (error: AxiosError<FSErrorResponse> | null) => {
        if (error !== null) {
            if (isFsError(error) && error.response) {
                const {
                    error: { code },
                } = error.response.data;
                if (code === 'access_token_error_decode' && jwtRefreshToken)
                    return useRefreshAndTryOneMoreTime(error.config);
            }
        }
        throw error;
    }
);

@injectable()
export class FsApi implements IBearerApi {
    public client: AxiosInstance;

    constructor() {
        this.client = fsApi;
    }
}
