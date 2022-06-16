import React, { useContext } from 'react';
import classNames from 'classnames';
import {
    getWidthHeightBySizes,
    makeSrcSet,
    SmartImageContext,
} from './helpers';
import { iBaseImg, ILazySizeProps, iSizes } from './interfaces';

const SimpleImg = ({
    imgClass,
    rootSrc,
    alt,
    sizes,
    isLazy,
    lazyProps,
}: iSimpleImg): JSX.Element => {
    const { makeAddress } = useContext(SmartImageContext);
    const srcAttribute = isLazy ? 'data-srcset' : 'srcSet';
    return (
        <img
            {...getWidthHeightBySizes(sizes)}
            {...{ [srcAttribute]: makeSrcSet(rootSrc, sizes, makeAddress) }}
            data-sizes={lazyProps?.sizes || 'auto'}
            data-expand={lazyProps?.expand}
            alt={alt || undefined}
            className={isLazy ? classNames('lazyload', imgClass) : imgClass}
            role="presentation"
        />
    );
};

interface iSimpleImg extends iBaseImg {
    sizes: iSizes[];
    lazyProps?: ILazySizeProps;
}

export { SimpleImg };
