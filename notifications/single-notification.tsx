import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import {
    INotification,
    NotificationType,
    removeNotification,
} from './notification-store';
import s from './notification-shower.module.scss';

export const SingleNotification = ({
    type,
    text,
    id,
    timeToLive,
}: ICPNotification): JSX.Element => {
    const [{ isActive, timeIsUp }, setState] = useState({ isActive: false, timeIsUp: false });

    const onTransitionEnd = () => {
        if (!isActive && timeIsUp) removeNotification(id);
    };

    useEffect(() => {
        setTimeout(() => setState({ isActive: true, timeIsUp: false }), 50);
        const timeOut = setTimeout(() => setState({ isActive: false, timeIsUp: true }), timeToLive);

        return () => {
            clearTimeout(timeOut);
        };
    }, []);

    return (
        <div
            className={cn(s.element, {
                [s._error]: type === NotificationType.error,
                'is-active': isActive,
            })}
            onTransitionEnd={onTransitionEnd}
            role="alert"
            aria-live="assertive"
            onClick={() => setState({ isActive: false, timeIsUp: true })}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    );
};

interface ICPNotification extends INotification {
    id: string;
}
