import React from 'react';
import { SmartImageContext } from './helpers';
import {
    IMakeAddressProps,
    ISmartImage,
} from './interfaces';
import { SmartImage } from './smart-image';

//audio boom is quete tricky api, there is only squares images with 300, 600, and 900 sizes

const makeBlurredBG = (): string => '';

const makeAddress = ({ rootSrc, width }: IMakeAddressProps): string =>
    `${rootSrc}/${width}x${width}`;

export const AudioBoomSmartImage = (props: ISmartImage): JSX.Element => (
    <SmartImageContext.Provider value={{ makeAddress, makeBlurredBG }}>
        <SmartImage {...props} hasBg={false} />
    </SmartImageContext.Provider>
);
