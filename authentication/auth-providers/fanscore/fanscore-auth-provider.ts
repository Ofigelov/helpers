import { AxiosError, AxiosResponse } from 'axios';
import qs from 'qs';
import { injectable } from 'inversify';
import {
    IAuthProvider,
    IClientPreferencesRequestParams,
    IProfile,
    IRegistrationParams,
} from 'fanx-ui-framework/general/services/authentication/interfaces';
import { IGeneralFormResponse } from 'fanx-ui-framework/general/interfaces/form-interfaces';

import { appConfig } from 'configuration/app-config';
import {
    loginEvent,
    logoutEvent,
    setPreferencesEvent,
} from 'fanx-ui-framework/general/services/authentication/auth-store';
import { deviceId } from './deviceId';
import { mapFSErrors, mapProfilePreferencesResponse, mapProfileResponse } from './mappers';
import {
    FSErrorResponse,
    IFanscoreProfileResponse,
    IFSClientPreferencesResponse,
} from './interfaces';
import { fsApi, fsFormEncodedApi } from './fs-client';

const catchAxiosError = ({ message, response }: AxiosError): IGeneralFormResponse => {
    const data = response?.data as FSErrorResponse | undefined;
    return {
        message: mapFSErrors(response?.data || response, `${data ? data.message : message}`),
        success: false,
    };
};

const processPreferencesResponse = ({
    data: { data },
}: AxiosResponse<IFSClientPreferencesResponse>): IGeneralFormResponse => {
    setPreferencesEvent(mapProfilePreferencesResponse(data));
    return SUCCESS;
};

const SUCCESS = Object.freeze({ success: true });

const sentSuccess = (): IGeneralFormResponse => SUCCESS;

@injectable()
export class FanscoreAuthProvider implements IAuthProvider {
    private getProfilePromise: Promise<IGeneralFormResponse> | null = null;

    logout = (): void => logoutEvent();

    socialLogin = (providerName: string, providerToken: string): Promise<IGeneralFormResponse> =>
        fsApi
            .post(appConfig.ssoEndpoints.socialLogin, {
                providerName,
                providerToken,
                clientId: appConfig.fanscore.clientId,
                deviceId,
            })
            .then(sentSuccess)
            .catch(catchAxiosError);

    register = ({ username, password }: IRegistrationParams): Promise<IGeneralFormResponse> =>
        fsFormEncodedApi
            .post(
                appConfig.ssoEndpoints.token,
                qs.stringify({
                    username,
                    password,
                    grant_type: 'register',
                    client_id: appConfig.fanscore.clientId,
                    device_id: deviceId,
                })
            )
            .then(this.getProfile)
            .catch(catchAxiosError);

    login = ({ username, password }: IRegistrationParams): Promise<IGeneralFormResponse> =>
        fsFormEncodedApi
            .post(
                appConfig.ssoEndpoints.token,
                qs.stringify({
                    username,
                    password,
                    grant_type: 'password',
                    client_id: appConfig.fanscore.clientId,
                    device_id: deviceId,
                })
            )
            .then(this.getProfile)
            .catch(catchAxiosError);

    private setUserInStore = ({
        data,
    }: AxiosResponse<IFanscoreProfileResponse>): IGeneralFormResponse => {
        loginEvent(mapProfileResponse(data));
        return SUCCESS;
    };

    getProfile = (): Promise<IGeneralFormResponse> => {
        if (!this.getProfilePromise)
            this.getProfilePromise = fsApi
                .get(appConfig.ssoEndpoints.profile)
                .then(this.setUserInStore)
                .catch(catchAxiosError)
                .finally(() => {
                    this.getProfilePromise = null;
                });
        return this.getProfilePromise;
    };

    getClientPreferences = (): Promise<IGeneralFormResponse> =>
        fsApi
            .get(appConfig.ssoEndpoints.getClientPreferences)
            .then(processPreferencesResponse)
            .catch(catchAxiosError);

    updateClientPreferences = (
        preferences: IClientPreferencesRequestParams
    ): Promise<IGeneralFormResponse> =>
        fsApi
            .post(appConfig.ssoEndpoints.updateClientPreferences, JSON.stringify(preferences))
            .then(this.getClientPreferences)
            .catch(catchAxiosError);

    updateProfile = (profileData: IProfile): Promise<IGeneralFormResponse> =>
        fsApi
            .patch(appConfig.ssoEndpoints.profile, profileData)
            .then(this.setUserInStore)
            .catch(catchAxiosError);

    forgottenPassword = (email: string): Promise<IGeneralFormResponse> =>
        fsApi
            .post(appConfig.ssoEndpoints.forgottenPassword, JSON.stringify({ email }), {
                params: {
                    clientId: appConfig.fanscore.clientId,
                },
            })
            .then(sentSuccess)
            .catch(catchAxiosError);

    changePassword = (oldPassword: string, newPassword: string): Promise<IGeneralFormResponse> =>
        fsApi
            .post(appConfig.ssoEndpoints.changePassword, { oldPassword, newPassword })
            .then(sentSuccess)
            .catch(catchAxiosError);

    changeEmail = (password: string, email: string): Promise<IGeneralFormResponse> =>
        fsApi
            .post<FSErrorResponse>(appConfig.ssoEndpoints.changeEmail, { password, email })
            .then(sentSuccess)
            .catch(catchAxiosError);

    verifyEmail = (user: string, code: string): Promise<IGeneralFormResponse> =>
        fsApi
            .post(
                appConfig.ssoEndpoints.verifyEmail
                    .replace('{userId}', user)
                    .replace('{code}', code),
                ''
            )
            .then(sentSuccess)
            .catch(catchAxiosError);

    changePasswordWithCode = (
        user: string,
        code: string,
        newPassword: string
    ): Promise<IGeneralFormResponse> =>
        fsApi
            .post(
                appConfig.ssoEndpoints.changePasswordWithCode.replace('{userId}', user),
                JSON.stringify({ newPassword }),
                {
                    params: {
                        code,
                    },
                }
            )
            .then(sentSuccess)
            .catch(catchAxiosError);
}

export const fanscoreAuthProvider = new FanscoreAuthProvider();
