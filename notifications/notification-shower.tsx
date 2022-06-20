import React from 'react';
import { useStore } from 'effector-react';
import { notificationStore } from 'fanx-ui-framework/general/services/notifications/notification-store';
import { SingleNotification } from 'project/components/notifications/single-notification';

export const NotificationShower = (): JSX.Element | null => {
    const store = useStore(notificationStore);
    const ids = Object.keys(store);
    if (!ids.length) return null;
    return (
        <>
            {ids.map((id) => (
                <SingleNotification key={id} id={id} {...store[id]} />
            ))}
        </>
    );
};
