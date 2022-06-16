import throttle from 'lodash/throttle';
import { SubscribeService } from './subscribe-service';

export const scrollConfig = Object.freeze({
    maxDuration: 600,
    minDuration: 300,
    throttleTime: 100,
    easings: {
        linear: (t: number): number => t,
        easeInOutQuart: (t: number): number =>
            t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    },
});

export interface IScrollOptions {
    duration?: number;
    easingFunction?: EasingFunction;
}

type EasingFunction = (t: number) => number;

class ScrollService extends SubscribeService<void> {
    constructor() {
        super();
        const handler = throttle(this.emit, scrollConfig.throttleTime);
        if (process.browser) window.addEventListener('scroll', () => handler(), { passive: true });
    }

    public scrollToCenter = (element: HTMLElement, options: IScrollOptions = {}) => {
        const { pageYOffset } = window;
        const { clientHeight } = document.documentElement;
        const { top } = element.getBoundingClientRect();
        const pos = pageYOffset + top - clientHeight / 2;
        this.scroll(pos, options);
    };

    public scrollToElementsTop = (
        element: HTMLElement,
        offset = 0,
        options: IScrollOptions = {}
    ) => {
        const { pageYOffset } = window;
        const { top } = element.getBoundingClientRect();
        const pos = top + pageYOffset + offset;
        const duration = Math.max(
            Math.min(Math.abs(document.documentElement.scrollTop - pos), scrollConfig.maxDuration),
            scrollConfig.minDuration
        );
        this.scroll(pos, { duration, ...options });
    };

    public scroll = (pos = 0, options: IScrollOptions = {}) => {
        this.animateScroll(pos, options);
    };

    private animateScroll(destination: number, options: IScrollOptions = {}) {
        const defaultOptions: IScrollOptions = {
            duration: scrollConfig.minDuration,
            easingFunction: scrollConfig.easings.easeInOutQuart,
        };
        const { duration, easingFunction } = { ...defaultOptions, ...options };
        const start = window.pageYOffset;
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const windowHeight =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.getElementsByTagName('body')[0].clientHeight;
        const destinationOffset = destination;
        const destinationOffsetToScroll = Math.round(
            documentHeight - destinationOffset < windowHeight
                ? documentHeight - windowHeight
                : destinationOffset
        );

        if (!('requestAnimationFrame' in window)) {
            window.scroll(0, destinationOffsetToScroll);
            return;
        }

        function scroll() {
            const now = 'now' in window.performance ? performance.now() : new Date().getTime();
            const time = Math.min(1, (now - startTime) / (duration as number));
            const timeFunctionResult = (easingFunction as EasingFunction)(time);
            window.scroll(
                0,
                Math.ceil(timeFunctionResult * (destinationOffsetToScroll - start) + start)
            );

            if (Math.ceil(window.pageYOffset) === destinationOffsetToScroll) {
                return;
            }

            requestAnimationFrame(scroll);
        }

        scroll();
    }
}

export const scrollService = new ScrollService();
