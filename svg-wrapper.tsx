import React, { SVGProps } from 'react';
import cn from 'classnames';

export interface IIconProps extends SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    fill?: string;
    isSymbol?: boolean;
    className?: string;
    hasDefaultClass?: boolean;
}

export interface ISvgWrapper extends IIconProps {
    size?: string[] | number[];
    svgSpriteId?: string;
}


const SvgWrapper = ({
    size,
    className,
    children,
    hasDefaultClass = true,
    isSymbol,
    svgSpriteId,
    ...props
}: ISvgWrapper): JSX.Element =>
    isSymbol ? (
        <symbol xmlns="http://www.w3.org/2000/svg" id={svgSpriteId} {...props}>
            {children}
        </symbol>
    ) : (
        <svg
            role="presentation"
            className={cn(className, { icon: hasDefaultClass }) || undefined}
            xmlns="http://www.w3.org/2000/svg"
            width={size ? size[0] : undefined}
            height={size ? size[1] || size[0] : undefined}
            focusable="false"
            {...props}
        >
            {children}
        </svg>
    );

export { SvgWrapper };
