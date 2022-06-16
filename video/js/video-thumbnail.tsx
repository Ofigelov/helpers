import React, { useEffect, useState } from 'react';
import { axios } from 'axios';
import { LazyImage } from '../../../general/js/lazy-image';
import { types } from './enums';

const SIZES = [320, 360, 640, 720, 960, 1280, 1440];

const _getSrcSet = (url: string) => {
    const delimeter = url.includes('?') ? '&' : '?';
    return SIZES.map((size) => `${url}${delimeter}width=${size} ${size}w`).join(', ');
};

interface vimeoAnswer {
    data: {
        thumbnail_url?: string;
    };
}

const VideoThumbnail = ({ srcSet, videoType, videoUrl, alt }: iVideoThumbnail) => {
    const [image, setImage] = useState(srcSet);

    useEffect(() => {
        if (!image) {
            switch (videoType) {
                case types.YOUTUBE:
                    setImage(_getSrcSet(`https://img.youtube.com/vi_webp/${videoUrl}/0.webp`));
                    break;
                case types.VIMEO:
                    axios.get(
                        `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoUrl}`
                    ).then(({ data: { thumbnail_url } }: vimeoAnswer) => {
                        if (thumbnail_url) setImage(_getSrcSet(thumbnail_url));
                    });
                    break;
                default:
                    break;
            }
        }
    }, [image, videoType, videoUrl]);

    return image ? <LazyImage src={image} alt={alt} /> : null;
};

interface iVideoThumbnail {
    srcSet?: string;
    videoType: string;
    alt?: string;
    videoUrl: string;
}

export default VideoThumbnail;
