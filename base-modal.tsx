import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import { pageLocker } from 'general/js/page-locker';

export const BaseModal = ({ children, closeCb, className, id = 'modal' }: IBaseModal) => {
    const closeCbWrapper = () => {
        if (typeof closeCb === 'function') {
            closeCb();
        }
    };

    useEffect(() => {
        const onKeydown = (e: KeyboardEvent) => {
            if (e.code === 'Escape') closeCbWrapper();
        };
        pageLocker?.lock(id);
        window.addEventListener('keydown', onKeydown);
        return () => {
            window.removeEventListener('keydown', onKeydown);
            pageLocker?.unlock(id);
        };
    }, []);
    return createPortal(
        <FocusTrap active={true} focusTrapOptions={{ allowOutsideClick: true }}>
            <dialog
                className={className}
                role="dialog"
                aria-label="modal window"
                aria-live="assertive"
                open
            >
                {children}
            </dialog>
        </FocusTrap>,
        document.body
    );
};

type AvailableTypes = JSX.Element | string | null | false;

export interface IBaseModal {
    id?: string;
    className?: string;
    children: AvailableTypes | AvailableTypes[];
    closeCb?: () => void;
}
