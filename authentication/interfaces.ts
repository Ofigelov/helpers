import { IGeneralFormResponse } from 'fanx-ui-framework/general/interfaces/form-interfaces';
import { AxiosInstance } from 'axios';

export interface IBearerApi {
    client: AxiosInstance;
}

export interface IAuthProvider {
    register(params: IRegistrationParams): Promise<IGeneralFormResponse>;
    login(params: IRegistrationParams): Promise<IGeneralFormResponse>;
    logout(): void;
    getProfile(): Promise<IGeneralFormResponse>;
    updateProfile(params: IProfile): Promise<IGeneralFormResponse>;
    forgottenPassword(email: string): Promise<IGeneralFormResponse>;
    socialLogin(provider: string, token: string): Promise<IGeneralFormResponse>;
    verifyEmail(user: string, code: string): Promise<IGeneralFormResponse>;
    changePasswordWithCode(
        user: string,
        code: string,
        password: string
    ): Promise<IGeneralFormResponse>;
    changePassword(oldPassword: string, newPassword: string): Promise<IGeneralFormResponse>;
    changeEmail(password: string, email: string): Promise<IGeneralFormResponse>;
    getClientPreferences(): Promise<IGeneralFormResponse>;
    updateClientPreferences(
        preferences: IClientPreferencesRequestParams
    ): Promise<IGeneralFormResponse>;
}

export interface IUserStore {
    user: IProfile | null;
    isLoggedIn: boolean;
    authToken: string | null;
    preferencesArr: IClientPreference[] | null;
}

export interface IAuthProviderCallbacks {
    onLogin(): void;
    onLogout(path?: string): void;
}

export interface IRegistrationParams {
    username: string;
    password: string;
}

export enum PossibleMarketingPreferences {
    email = 'email',
    sms = 'sms',
    post = 'post',
    phone = 'phone',
}

export const preferencesArray = [
    PossibleMarketingPreferences.sms,
    PossibleMarketingPreferences.email,
    PossibleMarketingPreferences.phone,
    PossibleMarketingPreferences.post,
];

export type IMarketingPreferencesParam = {
    [key in PossibleMarketingPreferences]: boolean;
};

export interface IExtendedMarketingPreferences {
    name: string;
    key: string;
    privacyPolicy: string;
    text: string;
    preferences: IMarketingPreferencesParam;
}

export interface IClientPreferencesRequestParams {
    preferences: {
        key: string;
        selectedOptionIds: number[];
    }[];
}

export interface IClientPreference {
    description: string;
    key: string;
    name: string;
    options: IPreferenceOption[];
}

interface IPreferenceOption {
    id: number;
    selected: boolean;
    value: string;
}

export interface IProfileParameters {
    [key: string]: string;
}

export type IProfileResponse = IGeneralFormResponse<IProfile>;

export interface IProfile {
    address1?: string;
    address2?: string;
    biography?: string;
    birthDate?: string;
    contactNumber?: string;
    country?: string;
    email?: string;
    firstName?: string;
    gender?: string;
    language?: string;
    lastName?: string;
    postcode?: string;
    town?: string;
}
