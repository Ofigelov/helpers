import {
    IClientPreference,
    IProfile,
} from 'fanx-ui-framework/general/services/authentication/interfaces';
import { FSErrorResponse, IFanscoreProfileResponse, IFSClientPreference } from './interfaces';
import { accountConfig } from 'configuration/account-config';

export const mapProfileResponse = ({ data }: IFanscoreProfileResponse): IProfile => ({
    address1: data.address1 || undefined,
    address2: data.address2 || undefined,
    biography: data.biography || undefined,
    birthDate: data.birthDate || undefined,
    contactNumber: data.contactNumber || undefined,
    country: data.country || undefined,
    email: data.email || undefined,
    firstName: data.firstName || undefined,
    gender: data.gender || undefined,
    language: data.language || undefined,
    lastName: data.lastName || undefined,
    postcode: data.postcode || undefined,
    town: data.town || undefined,
});

const isFSError = (a: any): a is FSErrorResponse => a && !!a.status;

export const mapFSErrors = (response: FSErrorResponse | any, fbMessage: string): string => {
    if (isFSError(response)) {
        if (response.error.code === 'bad_credentials') return accountConfig.messages.badCredentials;
    }
    return fbMessage;
};

export const mapProfilePreferencesResponse = (
    fsBodies: IFSClientPreference[]
): IClientPreference[] =>
    fsBodies.map(({ description, key, name, options }) => ({
        description,
        key,
        name,
        options,
    }));
