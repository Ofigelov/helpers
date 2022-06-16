import React, { useMemo } from 'react';
import { SmartImage } from './smart-image';
import { SmartImageContext } from './helpers';
import {
    IMakeAddressProps,
    ISmartImage,
} from './interfaces';
import { isWebpSupported } from './webp-detect';

const DEFAULT_INCROWD_QUALITY = 80;

const makeBlurredBG = (rootSrc: string, ratioWidthToHeight: number): string =>
    makeAddress({
        rootSrc: mergeParams(rootSrc, 'blur=20'),
        ratioWidthToHeight,
        width: 320,
        quality: 10,
    });

const mergeParams = (rootSrc: string, params: string): string =>
    `${rootSrc}${rootSrc?.includes('?') ? '&' : '?'}${params}`;

const makeAddress = ({
    rootSrc,
    ratioWidthToHeight,
    width,
    height,
    quality = DEFAULT_INCROWD_QUALITY,
}: IMakeAddressProps): string =>
    mergeParams(
        rootSrc,
        `width=${width}&height=${
            height !== undefined ? height : Math.floor(width * ratioWidthToHeight)
        }${quality !== DEFAULT_INCROWD_QUALITY ? '&quality=' + quality : ''}${
            isWebpSupported ? '&format=webp' : ''
        }`
    );

export const IncrowdSmartImage = (props: ISmartImage): JSX.Element => {
    const src = useMemo(() => props.rootSrc.replace('?raw=true', ''), [props.rootSrc]);
    return (
        <SmartImageContext.Provider value={{ makeAddress, makeBlurredBG }}>
            <SmartImage {...props} rootSrc={src} />
        </SmartImageContext.Provider>
    );
};
