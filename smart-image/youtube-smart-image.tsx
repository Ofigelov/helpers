import React, { useMemo } from 'react';
import { SmartImageContext } from './helpers';
import { ISmartImage } from './interfaces';

/*

https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api

Width | Height | URL
------|--------|----
120   | 90     | https://i.ytimg.com/vi/<VIDEO ID>/1.jpg
120   | 90     | https://i.ytimg.com/vi/<VIDEO ID>/2.jpg
120   | 90     | https://i.ytimg.com/vi/<VIDEO ID>/3.jpg
120   | 90     | https://i.ytimg.com/vi/<VIDEO ID>/default.jpg
320   | 180    | https://i.ytimg.com/vi/<VIDEO ID>/mq1.jpg
320   | 180    | https://i.ytimg.com/vi/<VIDEO ID>/mq2.jpg
320   | 180    | https://i.ytimg.com/vi/<VIDEO ID>/mq3.jpg
320   | 180    | https://i.ytimg.com/vi/<VIDEO ID>/mqdefault.jpg
480   | 360    | https://i.ytimg.com/vi/<VIDEO ID>/0.jpg
480   | 360    | https://i.ytimg.com/vi/<VIDEO ID>/hq1.jpg
480   | 360    | https://i.ytimg.com/vi/<VIDEO ID>/hq2.jpg
480   | 360    | https://i.ytimg.com/vi/<VIDEO ID>/hq3.jpg
480   | 360    | https://i.ytimg.com/vi/<VIDEO ID>/hqdefault.jpg
640   | 480    | https://i.ytimg.com/vi/<VIDEO ID>/sd1.jpg
640   | 480    | https://i.ytimg.com/vi/<VIDEO ID>/sd2.jpg
640   | 480    | https://i.ytimg.com/vi/<VIDEO ID>/sd3.jpg
640   | 480    | https://i.ytimg.com/vi/<VIDEO ID>/sddefault.jpg
1280  | 720    | https://i.ytimg.com/vi/<VIDEO ID>/hq720.jpg
1920  | 1080   | https://i.ytimg.com/vi/<VIDEO ID>/maxresdefault.jpg

mirrors: https://i.ytimg.com/vi/, https://img.youtube.com/vi/

as we can see main sizes is 120*90, 320*180, 480*360, 640*480, 1280*720, 1920*1080
last three is not guaranted to exist,
if youtube doesn't have them,
youtube will return image with lower size.
*/

type IYTImgNames = 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'hq720' | 'maxresdefault';
const getFileName = (width: number): IYTImgNames => {
    if (width <= 120) return 'default';
    if (width <= 320) return 'mqdefault';
    if (width <= 480) return 'hqdefault';
    if (width <= 640) return 'sddefault';
    if (width <= 1280) return 'hq720';
    return 'maxresdefault';
};

const makeBlurredBG = (id: string): string => `https://i.ytimg.com/vi/${id}/default.jpg`;

const makeAddress = (id: string, width: number): string =>
    `https://i.ytimg.com/vi/${id}/${getFileName(width)}.jpg`;

export const YouTubeSmartImage = (props: ISmartImage ): JSX.Element => {
    const id = useMemo(
        () =>
            (props.rootSrc.includes('vi/') && props.rootSrc.split('vi/')[1]?.split('/')[0]) ||
            props.rootSrc,
        [props.rootSrc]
    );
    return (
        <SmartImageContext.Provider
            value={{
                makeAddress: ({ width }) => makeAddress(id, width),
                makeBlurredBG: () => makeBlurredBG(id),
            }}
        >
            <SmartImage {...props} />
        </SmartImageContext.Provider>
    );
};
