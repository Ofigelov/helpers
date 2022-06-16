import React, { ReactElement, useRef, useEffect, useState } from 'react';
import Player from 'vimeo__player';
import { TypicalVideoProps } from './video-creator';

const VideoVimeo = ({ id, isActive, onReady = () => {} }: TypicalVideoProps): ReactElement => {
    const ref = useRef<HTMLDivElement>(null);
    const [player, setPlayer] = useState(null as Player | null);
    useEffect(() => {
        if (ref && ref.current) {
            import('@vimeo/player').then((module) => {
                const _Player = module.default;
                const _player = new _Player(ref.current?.parentElement as HTMLElement, {
                    id: parseInt(id),
                });
                _player.on('loaded', () => {
                    setPlayer(_player);
                    onReady();
                });
            });
        }
    }, []);
    useEffect(() => {
        if (isActive && player !== null) {
            player.play();
        } else if (!isActive && player !== null) {
            player.pause();
        }
        return () => {
            if (player) player.destroy();
        };
    }, [player, isActive]);
    return <div ref={ref} />;
};

export { VideoVimeo };
