import { createStore, createEvent } from 'effector';
import merge from 'lodash/merge';
import {
    IClientPreference,
    IProfile,
    IUserStore,
} from 'fanx-ui-framework/general/services/authentication/interfaces';

export const loginEvent = createEvent<IProfile>();
export const tokenUpdate = createEvent<string>();
export const logoutEvent = createEvent();
export const setPreferencesEvent = createEvent<IClientPreference[]>();

const blankStore: IUserStore = {
    user: null,
    isLoggedIn: false,
    authToken: null,
    preferencesArr: null,
};

export const authStore = createStore<IUserStore>(blankStore)
    .on(tokenUpdate, (state, authToken) => ({ ...state, authToken }))
    .on(loginEvent, (state, user) => ({ ...state, isLoggedIn: true, user }))
    .on(logoutEvent, () => blankStore)
    .on(setPreferencesEvent, (state, preferencesArr) => ({
        ...state,
        preferencesArr: merge(state.preferencesArr || [], preferencesArr),
    }));
