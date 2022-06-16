import React, { useState, useEffect, useCallback, createContext, ReactNode } from 'react';
import { Instance } from 'tippy.js';
import { scrollService } from './scroll-service';
import { SubscribeService } from './subscribe-service';

const popupSubscribeService = new SubscribeService();

interface IPopupWrapperContext {
    onShow: (inst: Instance) => void;
    onHide: () => void;
    isActive: boolean;
    close: () => void;
}

interface IPopupWrapper {
    id: string;
    children: ReactNode;
}

export const PopupWrapperContext = createContext({} as IPopupWrapperContext);

export const PopupWrapper = ({ children, id }: IPopupWrapper): JSX.Element => {
    const [isActive, setActive] = useState(false);
    const [instance, setInstance] = useState(null as null | Instance);
    const unsubscribe = () => {
        popupSubscribeService.unsubscribe(id);
        scrollService.unsubscribe(id);
    };
    let hideStarted = false;
    const close = (_inst?: Instance) => {
        if (!hideStarted) {
            hideStarted = true;
            (_inst || instance)?.hide();
            unsubscribe();
            setActive(false);
        }
    };
    const onShow = (inst: Instance) => {
        if (!instance) setInstance(inst);
        setActive(true);
        popupSubscribeService.emit(id);
        popupSubscribeService.subscribe(id, () => close(inst));
        scrollService.subscribe(id, () => close(inst));
    };
    useEffect(() => unsubscribe, []);
    return (
        <PopupWrapperContext.Provider
            value={{
                isActive,
                onShow,
                onHide: close,
                close,
            }}
        >
            {children}
        </PopupWrapperContext.Provider>
    );
};
