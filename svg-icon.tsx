import React from 'react';
import { SvgWrapper, ISvgWrapper } from './svg-wrapper';

interface ISpriteSvg extends ISvgWrapper {
    iconName: string;
}

export const SvgIcon = ({ iconName, className, ...props }: ISpriteSvg): JSX.Element => (
    <SvgWrapper className={className} {...props}>
        <use href={`#icon-${iconName}`} xlinkHref={`#icon-${iconName}`} />
    </SvgWrapper>
);
