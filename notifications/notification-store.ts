import { createStore, createEvent } from 'effector';
import { nanoid } from 'nanoid';

export enum NotificationType {
    success,
    error,
    other,
}

export interface INotification {
    id?: string;
    timeToLive?: number;
    text: string;
    type: NotificationType;
}

interface INotificationStore {
    [key: string]: INotification;
}

export const pushNewNotification = createEvent<INotification>();
export const removeNotification = createEvent<string>();

export const pushNewSuccessNotification = (text: string, timeToLive?: number) =>
    pushNewNotification({ text, type: NotificationType.success, timeToLive });

export const pushNewErrorNotification = (text: string, timeToLive?: number) =>
    pushNewNotification({ text, type: NotificationType.error, timeToLive });

export const notificationStore = createStore<INotificationStore>({})
    .on(
        pushNewNotification,
        (
            state,
            {
                id = nanoid(10),
                timeToLive = 5000,
                ...notification
            }
        ) => ({
            ...state,
            ...{ [id]: { timeToLive, ...notification } },
        })
    )
    .on(removeNotification, (state, id) => {
        if (state[id]) delete state[id];
        return { ...state };
    });
