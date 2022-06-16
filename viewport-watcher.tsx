import React, { useEffect } from 'react';
import { deviceObserver } from 'fanx-ui-framework/components/device-observer/device-observer';
import { removeStyles, setStyles } from 'fanx-ui-framework/general/services/dynamic-style-service';

const ID = 'viewportID';

export const ViewportWatcher = (): null => {
    const setViewPort = () =>
        setStyles({
            id: ID,
            selector: '.body',
            css: `--viewport-height: ${window.innerHeight}px;`,
        });

    useEffect(() => {
        setViewPort();
        const unsubscribe = deviceObserver?.subscribeOnResize(setViewPort);

        return () => {
            removeStyles(ID);
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return null;
};
