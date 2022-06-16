// @ts-ignore
import React, { ReactElement, useRef, useState, useEffect } from 'react';
// @ts-ignore
import { JWPlayer } from '@types/jwplayer';
import { TypicalVideoProps } from './video-creator';
import { jwLoader } from './jw-loader';

const JWPLAYER_KEY = '/2QZIZ0cfthAOKe/tkvaY0zHSqcIHZdA88Z+N2Czluk=';

const VideoJw = ({
    id,
    isActive,
    aspectRatio = '16:9',
    controls = true,
    repeat = false,
    mute = false,
    onReady = () => {},
}: TypicalVideoProps): ReactElement => {
    const ref = useRef<HTMLDivElement>(null);
    const [player, setPlayer] = useState(null as JWPlayer | null);
    useEffect(() => {
        jwLoader.onReady(() => {
            if (ref && ref.current) {
                const { jwplayer } = window as JWPlayer;
                jwplayer.key = JWPLAYER_KEY;
                const _player = jwplayer(ref.current.parentElement).setup({
                    width: '100%',
                    height: '100%',
                    repeat,
                    controls,
                    aspectratio: aspectRatio,
                    file: id,
                    mute,
                });
                player.on('ready', onReady);
                setPlayer(_player);
            }
        });
    }, []);
    useEffect(() => {
        if (isActive && player) {
            player.play();
        } else if (!isActive && player) {
            player.pause();
        }
        return () => {
            if (player) player.remove();
        };
    }, [player, isActive]);
    return <div ref={ref} />;
};

export { VideoJw };
