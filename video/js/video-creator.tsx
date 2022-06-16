import React, { ReactElement } from 'react';
import { types } from './enums';
import { VideoYoutube } from './video-youtube';
// import { VideoHTML5 } from './video-html5';
// import { VideoJw } from './video-jw';
import { VideoVimeo } from './video-vimeo';

const VideoCreator = ({ type, ...props }: iVideoCreator): ReactElement | null => {
    switch (type) {
        case types.YOUTUBE:
            return <VideoYoutube {...props} />;
        case types.VIMEO:
            return <VideoVimeo {...props} />;
        /*
        case types.JW:
            return <VideoJw {...props} />;
        I think if client wants to have html5 video it will a change request,
        and we'll need to improve it with different sources

        case types.HTML5:
            return <VideoHTML5 {...props} />;
        */
        default:
            return null;
    }
};

interface iVideoCreator extends TypicalVideoProps {
    type: string;
}

interface TypicalVideoProps {
    id: string;
    isActive: boolean;
    url: string;
    controls?: boolean;
    repeat?: boolean;
    aspectRatio?: string;
    mute?: boolean;
    onReady?: () => void;
}

export { VideoCreator, TypicalVideoProps };
