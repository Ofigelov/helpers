import React, { useState, useContext, createRef, useEffect } from 'react';
import classNames from 'classnames';
import {
    getWidthHeightBySizes,
    makeSrcSet,
    SmartImageContext,
} from './helpers';
import { iBaseImg, ILazySizeProps, iPictureSizes } from './interfaces';

type IonLoad = null | (() => void);
const LAZYLOADED = 'lazyloaded';

const SimplePicture = ({
    alt,
    imgClass,
    sizes,
    rootSrc,
    id,
    isLazy,
    lazyProps,
}: iPicture): JSX.Element => {
    const { makeAddress } = useContext(SmartImageContext);
    const [isLoaded, setLoaded] = useState(false);
    const ref = createRef<HTMLImageElement>();
    const srcAttribute = isLazy ? 'data-srcset' : 'srcSet';
    const classes = isLazy ? classNames('lazyload', imgClass) : imgClass;
    useEffect(() => {
        if (ref.current?.classList.contains(LAZYLOADED)) {
            setLoaded(true);
            return undefined;
        }
        let onLoad: IonLoad = () => {
            setLoaded(true);
            // @ts-ignore
            ref.current?.removeEventListener(LAZYLOADED, onLoad);
            onLoad = null;
        };
        ref.current?.addEventListener(LAZYLOADED, onLoad);
        return () => {
            // @ts-ignore
            if (onLoad) ref.current?.removeEventListener(LAZYLOADED, onLoad);
        };
    }, []);
    return (
        <picture className={classNames({ [LAZYLOADED]: isLoaded })} role="presentation">
            {sizes.map((size, index) => (
                <source
                    {...{ [srcAttribute]: makeSrcSet(rootSrc, [size], makeAddress) }}
                    key={id + index}
                    media={size.mediaQuery}
                />
            ))}
            <img
                {...getWidthHeightBySizes(sizes)}
                data-sizes={lazyProps?.sizes || 'auto'}
                data-expand={lazyProps?.expand}
                ref={ref}
                className={classes}
                alt={alt || undefined}
            />
        </picture>
    );
};
interface iPicture extends iBaseImg {
    sizes: iPictureSizes[];
    lazyProps?: ILazySizeProps;
    id: string;
}

export { SimplePicture };
