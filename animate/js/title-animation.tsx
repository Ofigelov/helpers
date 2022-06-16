import ReactDOM from 'react-dom';
import React from 'react';
import { TitleSpans } from './title-spans';
import { defaultValues, cssClasses } from './enums';

interface TitleAnimationProps {
    node: HTMLElement;
    delayStep: number;
    delay: number;
    duration: number;
}

class TitleAnimation {
    private node: HTMLElement;

    private isInited: boolean | undefined;

    private delayStep?: number;

    private delay?: number;

    private _timeForClear: number | undefined;

    private duration?: number;

    private timer: number | undefined;

    constructor({ node, delayStep, delay, duration }: TitleAnimationProps) {
        this.node = node;
        this.delay = delay;
        this.delayStep = delayStep;
        this.duration = duration;
        if (node !== null) {
            this._init();
        }
    }

    public animate = (): void => {
        if (this.timer) {
            clearTimeout(this.timer);
            this.node.classList.remove(cssClasses.FADE_OUT);
        }
        this.timer = setTimeout(this._onFinishAnimate, this._timeForClear);
        requestAnimationFrame(() => {
            this.node.classList.add(cssClasses.ACTIVE);
        });
    };

    public hide = (): void => {
        setTimeout(() => this._onFinishAnimate(true), this._timeForClear);
        requestAnimationFrame(() => {
            this.node.classList.add(cssClasses.FADE_OUT);
            this.node.classList.remove(cssClasses.ACTIVE);
        });
    };

    public destroy = (): void => {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (this.isInited) ReactDOM.unmountComponentAtNode(this.node);
    };

    private _init = (): void => {
        this.isInited = true;
        const text = this.node.textContent?.trim();
        const elemWidth = this.node.clientWidth;
        if (text) {
            this.node.setAttribute('aria-label', text);
            this.node.innerHTML = '';
            ReactDOM.render(
                <TitleSpans
                    parentNodeWidth={elemWidth}
                    text={text}
                    delayStep={this.delayStep || defaultValues.TITLE_STEP}
                    delayStart={this.delay || 0}
                    setTimeForClear={this._setTimeForClear}
                />,
                this.node
            );
        }
    };

    private _setTimeForClear = (last: number): void => {
        this._timeForClear = last + (this.duration || defaultValues.TITLE_DURATION);
    };

    private _onFinishAnimate = (isFadeOut: boolean | undefined): void => {
        if (isFadeOut) {
            this.node.classList.remove(cssClasses.FADE_OUT);
        }
    };
}

export { TitleAnimation };
