import { DcBaseComponent } from '@deleteagency/dc';
import { IDCRefsCollection } from '@deleteagency/dc/src/dc-dom';
// @ts-ignore
import Glide from './_glide/index';
import { deviceObserver } from 'general/js/device-observer';

export interface ISliderRefs extends IDCRefsCollection {
    cards: HTMLElement[];
    trackWrapper: HTMLElement;
}

export interface IGlideOptions {
    touchRatio?: number;
    rewind?: boolean;
    bound?: boolean;
    hoverpause?: boolean;
    gap: (() => number) | number;
    perView?: number;
    autoplay?: number | boolean;
    animationDuration?: number | boolean;
    rewindDuration?: number;
    type?: 'carousel' | 'slider';
    startAt?: number;

    focusAt?: number | 'center';
    keyboard?: boolean;
    swipeThreshold?: number | boolean;
    dragThreshold?: number | boolean;
    perTouch?: number | boolean;
    touchAngle?: number;
    animationTimingFunc?: string;
    direction?: 'ltr' | 'rtl';
    peek?:
        | number
        | {
              before: number;
              after: number;
          };
    breakpoints?: any;
    classes?: any;
    throttle?: number;
}

const IS_SWIPING = 'is-swiping';

export default class DcExpandGlideSlider<
    T extends HTMLElement,
    O = void,
    R extends void | ISliderRefs = void
> extends DcBaseComponent<T, O, R> {
    public slider: any;

    public cards: HTMLElement[];

    public trackWrapper: HTMLElement;

    public glideOptions: IGlideOptions;

    private unsubscribeResize?: CallableFunction | null;

    constructor(element: T, namespace: string, refs: string[]) {
        super(element, namespace, refs);

        this.cards = this.refs?.cards || [];
        this.trackWrapper = this.refs?.trackWrapper || this.element;
        this.glideOptions = {
            touchRatio: 1,
            rewind: false,
            bound: true,
            gap: 0,
            perView: 1,
            autoplay: false,
            animationDuration: 300,
            type: 'slider',
            hoverpause: true,
            rewindDuration: 300,
        };
    }

    onInit() {
        this.sliderInit();
    }

    onSliderInit = () => {};

    onSliderDestroy = () => {};

    public sliderInit = () => {
        this.unsubscribeResize = deviceObserver.subscribeOnResize(this._calculate);
        this._calculate();
    };

    private _initSlider = () => {
        this.element.classList.add('is-inited');
        this.slider = new Glide(this.element, this.glideOptions).mount();
        this.slider.on('swipe.move', () => this.element.classList.add(IS_SWIPING));
        this.slider.on('swipe.end', () =>
            setTimeout(() => this.element.classList.remove(IS_SWIPING), 30)
        );
        this.onSliderInit();
    };

    _destroySlider = () => {
        if (this.slider) {
            this.element.classList.remove('is-inited');
            this.slider.destroy();
            this.slider = null;
            this.onSliderDestroy();
        }
    };

    get _checkEnough() {
        const { cards, trackWrapper } = this;
        let { gap } = this.glideOptions;
        if (typeof gap === 'function') gap = gap();
        const result = cards.reduce(
            (val, card, index) =>
                val +
                card.getBoundingClientRect().width +
                (index < this.cards.length - 1 ? (gap as number) : 0),
            0
        );
        return result > trackWrapper.getBoundingClientRect().width;
    }

    _calculate = () => {
        const { slider, element } = this;
        const isEnough = this._checkEnough;
        if (!isEnough && slider) {
            slider.go('=0');
            this._destroySlider();
        } else if (isEnough && !slider) {
            this._initSlider();
        }
        element.classList[isEnough ? 'remove' : 'add']('is-not-enough');
    };

    destroy = () => {
        if (this.unsubscribeResize) this.unsubscribeResize();
        this.unsubscribeResize = null;
        this._destroySlider();
    };

    onDestroy = () => {
        this.destroy();
    };
}
