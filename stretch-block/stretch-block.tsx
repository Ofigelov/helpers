import React, { useRef, useState, useEffect, HTMLAttributes } from 'react';
import cn from 'classnames';
import s from './stretch-block.module.scss';

const ACTIVE_CLASS = 'is-active';

export const StretchBlock = ({
    children,
    isActive,
    className,
    style,
    ...props
}: IBlock & HTMLAttributes<HTMLDivElement>): JSX.Element => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState({
        _isActive: isActive,
        isAnimating: false,
        size: 0,
    });
    const { _isActive, isAnimating, size } = state;

    const onTransEnd = () => {
        setState({ ...state, isAnimating: false, _isActive: isActive });
    };

    const open = () => {
        if (containerRef.current) {
            setTimeout(() => {
                setState({
                    isAnimating: true,
                    size: containerRef.current?.clientHeight || 200,
                    _isActive: true,
                });
            }, 10);
        }
    };

    const close = () => {
        if (containerRef.current) {
            setState({
                isAnimating: true,
                _isActive: true,
                size: containerRef.current.clientHeight,
            });
            setTimeout(() => setState({ isAnimating: true, _isActive: true, size: 0 }), 20);
        }
    };

    useEffect(() => {
        if (!_isActive && isActive) open();
        if (_isActive && !isActive) close();
    }, [isActive, _isActive]);
    return (
        <div
            className={cn(s.wrap, className, { [ACTIVE_CLASS]: _isActive || isAnimating })}
            onTransitionEnd={onTransEnd}
            style={isAnimating ? { ...style, ...{ maxHeight: size + 'px' } } : style}
            {...props}
        >
            <div ref={containerRef}>{children}</div>
        </div>
    );
};

interface IBlock {
    isActive: boolean;
}
