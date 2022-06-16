import { define } from '../utils/object';

const _Sizes = function (Glide, Components, Events) {
    const Sizes = {
        getCurrentSlideWidth(slide) {
            /**
             * Method calculalates width of current slide
             *
             * @returns {number}
             */
            if (typeof slide === 'number') {
                slide = Components.Html.slides[slide];
            }

            return slide.getBoundingClientRect().width;
        },
    };

    define(Sizes, 'length', {
        /**
         * Gets count number of the slides.
         *
         * @return {Number}
         */
        get() {
            return Components.Html.slides.length;
        },
    });

    define(Sizes, 'width', {
        /**
         * Gets width value of the slider (visible area).
         *
         * @return {Number}
         */
        get() {
            return Components.Html.track.getBoundingClientRect().width;
        },
    });

    define(Sizes, 'wrapperSize', {
        /**
         * Gets size of the slides wrapper.
         *
         * @return {Number}
         */
        get() {
            const width = Components.Html.slides.reduce(
                (val, slide) => val + Sizes.getCurrentSlideWidth(slide),
                0
            );
            return width + Components.Gaps.grow + Components.Clones.grow;
        },
    });

    define(Sizes, 'slideWidth', {
        /**
         * Gets width value of a single slide.
         *
         * @return {Number}
         */
        get() {
            const { width } = Sizes;
            const { perView } = Glide.settings;
            return (
                (width -
                    (Components.Peek.value.before + Components.Peek.value.after ||
                        Components.Peek.value * 2)) /
                perView
            );
        },
    });

    return Sizes;
};

export default _Sizes;
