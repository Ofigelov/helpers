import React, { ReactElement, useRef, useEffect, useState } from 'react';
import { TypicalVideoProps } from './video-creator';

const VideoHTML5 = ({
    url,
    isActive,
    controls = true,
    onReady,
    mute = false,
}: TypicalVideoProps): ReactElement => {
    const [isLoaded, setLoading] = useState(false);
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (isActive && isLoaded && ref && ref.current) {
            ref.current.play();
        } else if (!isActive && isLoaded && ref && ref.current) {
            ref.current.pause();
        }
    }, [isActive, isLoaded]);
    const onLoad = () => {
        setLoading(true);
        if (isActive && ref && ref.current) ref.current.play();
        if (onReady) onReady();
    };
    return (
        <video controls={controls} ref={ref} onLoad={!isLoaded ? onLoad : undefined} muted={mute}>
            <source src={url} />
        </video>
    );
};

export { VideoHTML5 };
