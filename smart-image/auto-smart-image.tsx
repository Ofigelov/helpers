import React, { useMemo } from 'react';
import { ISmartImage } from './interfaces';
import { YouTubeSmartImage } from './youtube-smart-image';
import { AudioBoomSmartImage } from './audioboom-smart-image';
import { StreamAmgSmartImage } from './stream-amg-smart-image';
import { IncrowdSmartImage } from './incrowd-smart-image';
import { SmartImage } from './smart-image';

const getComponentByUrl = (rootSrc: string): ((_props: ISmartImage) => JSX.Element) => {
    if (rootSrc.includes('img.youtube') || rootSrc.includes('i.ytimg.com'))
        return YouTubeSmartImage;
    if (rootSrc.includes('.streamamg')) return StreamAmgSmartImage;
    if (rootSrc.includes('images.theabcdn')) return AudioBoomSmartImage;
    if (rootSrc.includes('incrowdsports')) return IncrowdSmartImage;
    return SmartImage;
};

export const AutoSmartImage = (props: ISmartImage): JSX.Element => {
    const Component = useMemo(() => getComponentByUrl(props.rootSrc), [props.rootSrc]);
    return <Component {...props} />;
};
