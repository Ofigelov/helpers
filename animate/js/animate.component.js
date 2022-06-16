import { DcBaseComponent } from '@deleteagency/dc';
import { isEmptyArray } from 'src/general/js/array-helper';
import { scrollObserver } from 'src/general/js/scroll-observer';
import { ClipAnimation } from './clip-animation';
import { TransitionAnimation } from './transition-animation';
import { TitleAnimation } from './title-animation';
import { defaultValues } from './enums';
import { loadPromise } from './load-promise';

function Animations(Animation, refs, step, _delay, _options) {
    if (!isEmptyArray(refs)) {
        this.animations = refs.map((node, index) => {
            const options = node.hasAttribute(defaultValues.OPTIONS_ATTR)
                ? JSON.parse(node.getAttribute(defaultValues.OPTIONS_ATTR))
                : {};
            const { delay = index * step + _delay } = options;
            return new Animation({
                ..._options,
                ...options,
                node,
                delay,
            });
        });
        this.delay = _delay;
    } else {
        this.animations = [];
        this.delay = 0;
    }
}

const FINISHED_CLASS = 'is-finished';
const LOAD_ANIMATION_ATTRIBUTE = 'data-dc-load-animation';

export default class AnimateComponent extends DcBaseComponent {
    static getNamespace() {
        return 'animate';
    }

    onInit() {
        this.loadAnimation = document.querySelector(`[${LOAD_ANIMATION_ATTRIBUTE}]`);
        if (!this.loadAnimation || this.loadAnimation.matches(`.${FINISHED_CLASS}`)) {
            this._startInit();
        } else {
            this.loadAnimation.addEventListener('animationend', this._onFinishloadAnimation);
        }
    }

    _onFinishloadAnimation = () => {
        this.loadAnimation.removeEventListener('animationend', this._onFinishloadAnimation);
        this._startInit();
    };

    _startInit = () => {
        this.unsubscribe = scrollObserver.subscribe(this.element, () => {
            if (isEmptyArray(Object.keys(this.refs))) {
                new TransitionAnimation({ node: this.element }).animate();
            } else {
                this._initAnimations();
                if (!isEmptyArray(this.refs.clipBlocks)) {
                    loadPromise(this.refs.clipBlocks, this.options.timeOutImageLoad).then(
                        this._startAnimate
                    );
                } else {
                    this._startAnimate();
                }
            }
            this.unsubscribe();
        });
    };

    _initAnimations = () => {
        const {
            clipStep,
            clipDelay,
            titleStep,
            titleDelay,
            scaleStep,
            scaleDelay,
            fadeStep,
            fadeDelay,
        } = this.options;
        const { scaleBlocks, fadeBlocks, titleBlocks, clipBlocks } = this.refs;
        const clips = new Animations(
            ClipAnimation,
            clipBlocks,
            clipStep || defaultValues.CLIP_STEP,
            clipDelay || 0
        );
        const titles = new Animations(
            TitleAnimation,
            titleBlocks,
            titleStep || defaultValues.TITLE_STEP,
            titleDelay || clips.delay + defaultValues.BLOCK_DELAY
        );
        const scales = new Animations(
            TransitionAnimation,
            scaleBlocks,
            scaleStep || defaultValues.BLOCK_STEP,
            scaleDelay || clips.delay + titles.delay + defaultValues.BLOCK_DELAY,
            { name: 'transform' }
        );
        const fades = new Animations(
            TransitionAnimation,
            fadeBlocks,
            fadeStep || defaultValues.BLOCK_STEP,
            fadeDelay || clips.delay + titles.delay + scales.delay + defaultValues.BLOCK_DELAY,
            { name: 'opacity' }
        );
        this.animations = [
            ...clips.animations,
            ...titles.animations,
            ...scales.animations,
            ...fades.animations,
        ];
    };

    _startAnimate = () => {
        this.animations.forEach((animation) => animation.animate());
    };

    onDestroy = () => {
        this.animations.forEach((animation) => animation.destroy());
        this.unsubscribe();
    };
}
