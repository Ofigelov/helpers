import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { TypicalVideoProps } from './video-creator';
import { youtubeLoader } from './youtube-loader';

const VideoYoutube = ({ id, isActive, onReady = () => {} }: TypicalVideoProps): ReactElement => {
    const ref = useRef<HTMLDivElement>(null);
    const [player, setPlayer] = useState(null as YT.Player | null);
    useEffect(() => {
        youtubeLoader.onReady(() => {
            if (ref && ref.current) {
                const _player = new YT.Player(ref.current as HTMLElement, {
                    height: '100%',
                    width: '100%',
                    videoId: id,
                    playerVars: {
                        rel: 0,
                    },
                    events: {
                        onReady: () => {
                            setPlayer(_player);
                            onReady();
                        },
                    },
                });
            }
        });
    }, []);
    useEffect(() => {
        if (isActive && player) {
            player.playVideo();
        } else if (!isActive && player) {
            player.stopVideo();
        }
        return () => {
            if (player) player.destroy();
        };
    }, [player, isActive]);
    return <div ref={ref} />;
};

export { VideoYoutube };
