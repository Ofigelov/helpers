import { dynamicStylesService } from '@ofigelov/dynamic-styles-service';
import { cssClasses, defaultValues, imagesFactorials } from './enums';
import { nanoid } from 'nanoid';
/*
const EXAMPLE_FACTORIALS = {
    steps: ['0', '100'],
    left: {
        0: { v: 1 },
        100: { v: 0.4 }
    },
    right: {
        0: { v: 1 },
        100: { v: 1, offset: 40 }
    },
    top: {
        0: { v: 0 },
        100: { v: 0 }
    },
    bottom: {
        0: { v: 1 },
        100: { v: 1 }
    },
};
*/
interface iSide {
    [key: string]: {
        v: number;
        offset?: number;
    };
}

interface iFactorials {
    steps: string[];
    top: iSide;
    right: iSide;
    bottom: iSide;
    left: iSide;
}

interface ClipAnimationProps {
    node: HTMLElement;
    name: string;
    duration?: number;
    delay?: number;
}

class ClipAnimation {
    private isActive = false;

    private node: HTMLElement;

    private id: string = nanoid(10);

    private duration: number;

    private delay: number;

    private factorials: iFactorials;

    constructor({
        node,
        name,
        duration = defaultValues.CLIP_DURATION,
        delay = 0,
    }: ClipAnimationProps) {
        this.node = node;
        this.duration = duration;
        this.delay = delay;
        this.factorials = this._getFactorials(name);
        if (node && node.clientWidth > 0) {
            this._init();
        }
    }

    private _init = (): void => {
        this._makeStyles();
        this._setAnimationStyles();
    };

    private _getFactorials = (name: string): iFactorials => {
        switch (name) {
            case 'clipLeft':
                return imagesFactorials.RIGHT_TO_LEFT;
            case 'clipRight':
                return imagesFactorials.LEFT_TO_RIGHT;
            default:
                return imagesFactorials.BOTTOM_TO_TOP;
        }
    };

    public animate = (): void => {
        const { node, id } = this;
        if (node && node.clientWidth > 0) {
            node.addEventListener('animationend', this._onAnimationFinish);
            node.style.animationName = id;
            this.isActive = true;
        }
    };

    private _setAnimationStyles = (): void => {
        const { node, duration, delay } = this;
        if (duration !== defaultValues.CLIP_DURATION)
            node.style.animationDuration = duration + 'ms';
        if (delay > 0) node.style.animationDelay = delay + 'ms';
    };

    private _onAnimationFinish = (): void => {
        this.isActive = false;
        this.node.removeEventListener('animationend', this._onAnimationFinish);
        this.node.classList.add(cssClasses.FINISHED);
        this.node.style.animationName = '';
        dynamicStylesService.remove(this.id);
    };

    private _makeStyles = () => {
        const { id } = this;
        dynamicStylesService.setStyles({
            id,
            selector: `@keyframes ${id}`,
            css: this._getKeyFrames(),
        });
    };

    private _getRect = (step: string): string => {
        const { node, _getV, factorials } = this;
        const width = node.clientWidth;
        const height = node.clientHeight;
        return (
            `rect(${_getV(height, factorials.top, step)}px,` +
            `${_getV(width, factorials.right, step)}px,` +
            `${_getV(height, factorials.bottom, step)}px,` +
            `${_getV(width, factorials.left, step)}px)`
        );
    };

    private _getV = (size: number, side: iSide, step: string): number => {
        return Math.floor(size * side[step].v - (side[step].offset || 0));
    };

    private _getKeyFrames = (): string =>
        `${this.factorials.steps
            .map((step) => `${step}% { clip: ${this._getRect(step)}}`)
            .join(' ')}`;

    public destroy = (): void => {
        if (this.isActive) this.node.removeEventListener('animationend', this._onAnimationFinish);
    };
}

export { iFactorials, ClipAnimation };
