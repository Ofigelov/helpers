import { createContext } from 'react';
import {
    IMakeAddress,
    iSizes,
    ISmartImageContext,
} from './interfaces';

export const SmartImageContext = createContext<ISmartImageContext>({
    makeAddress: () => '/images/wrong-component.png',
    makeBlurredBG: () => '',
});

export const getWidthHeightBySizes = (sizes: iSizes[]) => {
    const width = sizes[0].sizeValues[0];
    const height = Math.floor(width / sizes[0].ratioWidthToHeight);
    return { width, height };
};

export const makeSrcSet = (rootSrc: string, sizes: iSizes[], makeAddress: IMakeAddress): string =>
    sizes
        .map(({ ratioWidthToHeight, sizeValues, addHeightDescriptor }) =>
            sizeValues
                .map((value) => {
                    const width = value;
                    const height = Math.floor(width / ratioWidthToHeight);
                    return `${makeAddress({
                        rootSrc,
                        ratioWidthToHeight,
                        width,
                        height,
                    })} ${width}w${addHeightDescriptor ? ' ' + height + 'h' : ''}`;
                })
                .join(', ')
        )
        .join(', ');
