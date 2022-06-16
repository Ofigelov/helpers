import { CSSProperties } from 'react';

export interface iSizes {
    sizeValues: number[];
    ratioWidthToHeight: number;
    addHeightDescriptor?: boolean;
}

export interface iPictureSizes extends iSizes {
    mediaQuery?: string;
}

export interface iBaseImg {
    imgClass: string;
    rootSrc: string;
    alt: string | null;
    isLazy: boolean;
}

export interface ILazySizeProps {
    expand?: number;
    sizes?: number | 'auto';
}

export interface ISmartImage {
    lazyProps?: ILazySizeProps;
    hasBg?: boolean;
    isPicture?: boolean;
    ofContain?: boolean;
    rootSrc: string;
    sizes: iSizes[] | iPictureSizes[];
    additionalImageClassName?: string;
    additionalWrapperClassName?: string;
    alt: string | null;
    style?: CSSProperties;
    onTransitionEnd?: () => void;
    className?: string;
    isLazy?: boolean;
}

export type IMakeAddress = (props: IMakeAddressProps) => string;

export interface ISmartImageContext {
    makeAddress: IMakeAddress;
    makeBlurredBG(rootSrc: string, ratioWidthToHeight: number): string;
}

export interface IMakeAddressProps {
    rootSrc: string;
    ratioWidthToHeight: number;
    width: number;
    height?: number;
    quality?: number;
}
