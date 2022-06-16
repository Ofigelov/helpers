import { cssClasses } from './enums';

interface TransitionAnimationProps {
    node: HTMLElement;
    delay?: number;
    transitionName?: string;
    duration: number;
}

class TransitionAnimation {
    private readonly transitionName: string;

    private readonly delay: number;

    private readonly duration: number;

    private node: HTMLElement;

    constructor({
        node,
        delay = 0,
        transitionName = 'opacity',
        duration,
    }: TransitionAnimationProps) {
        this.node = node;
        this.delay = delay;
        this.transitionName = transitionName;
        this.duration = duration;
        this._init();
    }

    _init = (): void => {
        if (this.delay > 0) this.node.style.transitionDelay = this.delay + 'ms';
        if (this.duration !== undefined) {
            this.node.style.transitionDuration = this.duration + 'ms';
        }
    };

    public animate = (): void => {
        this.node.style.willChange = this.transitionName;
        requestAnimationFrame(() => {
            this.node.classList.add(cssClasses.ACTIVE);
        });
        setTimeout(() => {
            this.node.style.willChange = '';
        }, this.duration);
    };
}

export { TransitionAnimation };
