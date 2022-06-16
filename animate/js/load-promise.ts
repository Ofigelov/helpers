import { isEmptyArray } from '../../../general/js/array-helper';
import { defaultValues } from './enums';

const LAZY_LOADED_CLASS = 'lazyloaded';

const setLazyLoad = (node: HTMLElement, resolve: CallableFunction): CallableFunction => {
    const _onLazyLoad = () => {
        node.removeEventListener(LAZY_LOADED_CLASS, _onLazyLoad);
        resolve();
    };
    node.addEventListener(LAZY_LOADED_CLASS, _onLazyLoad);
    return () => node.removeEventListener(LAZY_LOADED_CLASS, _onLazyLoad);
};

/*
    we have used polyfill in ie, which generated duplicate img for emulate style "objectfit",
     so it's little hack for prevent making useless listeners
*/
// const _validImage = (parent) => [...parent.querySelectorAll('img')].reverse()[0];

export const loadPromise = (domItems: HTMLElement[], timeOut?: number): Promise<null> =>
    new Promise((resolve, reject) => {
        const callbacks: CallableFunction[] = [];
        if (isEmptyArray(domItems)) reject();
        const promises = domItems.map(
            (node) =>
                new Promise((_resolve) => {
                    const img = node.matches('img') ? node : node.querySelector('img');
                    if (img === null || img.querySelector(`.${LAZY_LOADED_CLASS}`)) {
                        _resolve();
                    } else {
                        callbacks.push(setLazyLoad(img, _resolve));
                    }
                })
        );
        const timer = setTimeout(() => {
            callbacks.forEach((cb) => cb());
            resolve();
        }, timeOut || defaultValues.TIMEOUT_IMAGE_LOAD);
        Promise.all(promises).then(() => {
            clearTimeout(timer);
            resolve();
        });
    });
