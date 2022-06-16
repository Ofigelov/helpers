import React, { useEffect, useState, useContext } from 'react';
import { nanoid } from 'nanoid';
import classNames from 'classnames';
import { SmartImageContext } from './helpers';
import { SimplePicture } from './simple-picture';
import { SimpleImg } from './simple-img';
import { ISmartImage } from './interfaces';

const CONTAIN_CLASS = 'of-contain';
const COVER_CLASS = 'of-cover';

const SmartImage = ({
    hasBg = true,
    isPicture = false,
    rootSrc,
    sizes,
    additionalImageClassName = '',
    additionalWrapperClassName = '',
    ofContain,
    alt,
    style,
    onTransitionEnd,
    className,
    isLazy = true,
    lazyProps,
}: ISmartImage): JSX.Element => {
    const [id, setId] = useState(nanoid(10));
    const { makeBlurredBG } = useContext(SmartImageContext);
    useEffect(() => {
        setId(nanoid(10));
    }, [rootSrc]);

    const wrpClass = classNames({
        [additionalWrapperClassName]: additionalWrapperClassName !== '',
        [COVER_CLASS]: !ofContain,
        [CONTAIN_CLASS]: ofContain,
    });

    const imgClass = classNames({
        [additionalImageClassName]: additionalImageClassName !== '',
    });

    const childProps = {
        imgClass,
        alt,
        rootSrc,
        sizes,
        isLazy,
        lazyProps,
    };

    return (
        <div
            key={id}
            className={classNames(wrpClass, className)}
            style={style}
            onTransitionEnd={onTransitionEnd}
        >
            {!!rootSrc && isPicture ? (
                <SimplePicture {...childProps} id={id} />
            ) : (
                <SimpleImg {...childProps} />
            )}
            {!!rootSrc && hasBg && (
                <img
                    className={imgClass}
                    loading="lazy"
                    aria-hidden={true}
                    alt={alt || undefined}
                    src={makeBlurredBG(rootSrc, sizes[0].ratioWidthToHeight)}
                />
            )}
        </div>
    );
};

export { SmartImage };
