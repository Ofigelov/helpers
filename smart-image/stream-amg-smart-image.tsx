import React, { useMemo } from 'react';
import { SmartImageContext } from './helpers';
import { IMakeAddressProps, ISmartImage } from './interfaces';
import { isWebpSupported } from './webp-detect';
import { SmartImage } from './smart-image';

const makeBlurredBG = (rootSrc: string, ratioWidthToHeight: number): string =>
    makeAddress({
        rootSrc,
        ratioWidthToHeight,
        width: 320,
        quality: 10,
    });

const makeAddress = ({
    rootSrc,
    ratioWidthToHeight,
    width,
    height,
    quality = '80',
}: IMakeAddressProps): string =>
    `${rootSrc}/width/${width}/height/${
        height !== undefined ? height : Math.floor(width * ratioWidthToHeight)
    }/quality/${quality}${isWebpSupported ? '/format/webp' : ''}`;

const keyPath = 'thumbnail/entry_id';

const makeBaseUrl = (rootSrc: string): string | undefined => {
    const entryId = rootSrc.split(keyPath)[1].split('/')[1];
    const start = rootSrc.split(keyPath + '/' + entryId)[0];
    if (!entryId || !start) return undefined;
    return `${start}${keyPath}/${entryId}`;
};

export const StreamAmgSmartImage = (props: ISmartImage): JSX.Element => {
    const rootSrc = useMemo(
        () => (props.rootSrc.includes(keyPath) && makeBaseUrl(props.rootSrc)) || props.rootSrc,
        [props.rootSrc]
    );
    return (
        <SmartImageContext.Provider
            value={{
                makeAddress: (params) => makeAddress({ ...params, rootSrc }),
                makeBlurredBG: (_, ratio) => makeBlurredBG(rootSrc, ratio),
            }}
        >
            <SmartImage {...props} />
        </SmartImageContext.Provider>
    );
};
