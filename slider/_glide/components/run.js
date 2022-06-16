import { warn } from '../utils/log';
import { toInt } from '../utils/unit';
import { define } from '../utils/object';

const _Run = function (Glide, Components, Events) {
    const Run = {
        /**
         * Initializes autorunning of the glide.
         *
         * @return {Void}
         */
        mount() {
            this._o = false;
        },

        /**
         * Makes glides running based on the passed moving schema.
         *
         * @param {String} move
         */
        make(move, swipeDistance) {
            if (!Glide.disabled) {
                !Glide.settings.waitForTransition || Glide.disable();

                this.move = move;

                Events.emit('run.before', this.move);

                this.calculate(swipeDistance);

                Events.emit('run', this.move);

                Components.Transition.after(() => {
                    if (this.isStart()) {
                        Events.emit('run.start', this.move);
                    }

                    if (this.isEnd()) {
                        Events.emit('run.end', this.move);
                    }

                    if (this.isOffset()) {
                        this._o = false;

                        Events.emit('run.offset', this.move);
                    }

                    Events.emit('run.after', this.move);

                    Glide.enable();
                });
            }
        },

        /**
         * Calculates current index based on defined move.
         *
         * @return {Number|Undefined}
         */
        calculate(swipeDistance) {
            const { move, length } = this;
            const { steps, direction } = move;
            // By default assume that size of view is equal to one slide
            let viewSize = 1;
            // While direction is `=` we want jump to
            // a specified index described in steps.
            if (direction === '=') {
                Glide.index = steps;
                return;
            }

            // When pattern is equal to `>>` we want
            // fast forward to the last slide.
            if (direction === '>' && steps === '>') {
                Glide.index = length;
                return;
            }

            // When pattern is equal to `<<` we want
            // fast forward to the first slide.
            if (direction === '<' && steps === '<') {
                Glide.index = 0;

                return;
            }

            // pagination movement
            if (direction === '|') {
                viewSize = Glide.settings.perView || 1;
            }

            // we are moving forward
            if (direction === '>' || (direction === '|' && steps === '>')) {
                const index = calculateForwardIndex(viewSize, swipeDistance);
                if (index > length) this._o = true;

                Glide.index = normalizeForwardIndex(index, viewSize);

                return;
            }

            // we are moving backward
            if (direction === '<' || (direction === '|' && steps === '<')) {
                const index = calculateBackwardIndex(viewSize, swipeDistance);

                if (index < 0) this._o = true;

                Glide.index = normalizeBackwardIndex(index, viewSize);

                return;
            }

            warn(`Invalid direction pattern [${direction}${steps}] has been used`);
        },

        /**
         * Checks if we are on the first slide.
         *
         * @return {Boolean}
         */
        isStart() {
            return Glide.index <= 0;
        },

        /**
         * Checks if we are on the last slide.
         *
         * @return {Boolean}
         */
        isEnd() {
            return Glide.index >= this.length;
        },

        /**
         * Checks if we are making a offset run.
         *
         * @param {String} direction
         * @return {Boolean}
         */
        isOffset(direction = undefined) {
            if (!direction) return this._o;

            if (!this._o) return false;

            // did we view to the right?
            if (direction === '|>') {
                return this.move.direction === '|' && this.move.steps === '>';
            }

            // did we view to the left?
            if (direction === '|<') {
                return this.move.direction === '|' && this.move.steps === '<';
            }

            return this.move.direction === direction;
        },

        /**
         * Checks if bound mode is active
         *
         * @return {Boolean}
         */
        isBound() {
            return (
                Glide.isType('slider') &&
                Glide.settings.focusAt !== 'center' &&
                Glide.settings.bound
            );
        },
    };

    /**
     * Tries to take actual index by swipe distance
     * @param swipeDistance, realPos
     * @return {Number || null}
     */

    function getIndexBySwipeDistance(swipeDistance) {
        const realPos = Components.Move.translate - swipeDistance;
        if (realPos < 0) return 0;
        let pos = 0;
        for (let i = 0; i < Components.Html.slides.length; i++) {
            const slideWidth = Components.Sizes.getCurrentSlideWidth(i);
            if (realPos >= pos && realPos < pos + slideWidth) {
                if (realPos >= pos + slideWidth / 2) return i + 1;
                return i;
            }

            pos += slideWidth;
        }
        return null;
    }

    /**
     * Returns index value to move forward/to the right
     *
     * @param viewSize
     * @returns {Number}
     */

    function calculateForwardIndex(viewSize, swipeDistance) {
        const { index } = Glide;

        if (Glide.isType('carousel')) return index + viewSize;

        if (typeof swipeDistance !== 'undefined') {
            const _index = getIndexBySwipeDistance(swipeDistance);
            if (_index !== null) return _index;
        }

        return index + (viewSize - (index % viewSize));
    }

    /**
     * Normalizes the given forward index based on glide settings, preventing it to exceed certain boundaries
     *
     * @param index
     * @param length
     * @param viewSize
     * @returns {Number}
     */
    function normalizeForwardIndex(index, viewSize) {
        const { length } = Run;

        if (index <= length) return index;

        if (Glide.isType('carousel')) return index - (length + 1);

        if (Glide.settings.rewind) {
            // bound does funny things with the length, therefor we have to be certain
            // that we are on the last possible index value given by bound
            if (Run.isBound() && !Run.isEnd()) {
                return length;
            }

            return 0;
        }

        if (Run.isBound()) return length;

        return Math.floor(length / viewSize) * viewSize;
    }

    /**
     * Calculates index value to move backward/to the left
     *
     * @param viewSize
     * @returns {Number}
     */
    function calculateBackwardIndex(viewSize, swipeDistance) {
        const { index } = Glide;

        if (Glide.isType('carousel')) return index - viewSize;

        // ensure our back navigation results in the same index as a forward navigation
        // to experience a homogeneous paging
        const view = Math.ceil(index / viewSize);

        if (swipeDistance) {
            const _index = getIndexBySwipeDistance(swipeDistance);
            if (_index !== null) return _index;
        }

        return (view - 1) * viewSize;
    }

    /**
     * Normalizes the given backward index based on glide settings, preventing it to exceed certain boundaries
     *
     * @param index
     * @param length
     * @param viewSize
     * @returns {*}
     */
    function normalizeBackwardIndex(index, viewSize) {
        const { length } = Run;

        if (index >= 0) return index;

        if (Glide.isType('carousel')) return index + (length + 1);

        if (Glide.settings.rewind) {
            // bound does funny things with the length, therefor we have to be certain
            // that we are on first possible index value before we to rewind to the length given by bound
            if (Run.isBound() && Run.isStart()) {
                return length;
            }

            return Math.floor(length / viewSize) * viewSize;
        }

        return 0;
    }

    define(Run, 'move', {
        /**
         * Gets value of the move schema.
         *
         * @returns {Object}
         */
        get() {
            return this._m;
        },

        /**
         * Sets value of the move schema.
         *
         * @returns {Object}
         */
        set(value) {
            let step = value.substr(1);

            this._m = {
                direction: value.substr(0, 1),
                steps: step ? (toInt(step) ? toInt(step) : step) : 0,
            };
        },
    });

    define(Run, 'length', {
        /**
         * Gets value of the running distance based
         * on zero-indexing number of slides.
         *
         * @return {Number}
         */
        get() {
            let { length } = Components.Html.slides;
            // If the `bound` option is active, a maximum running distance should be
            // reduced by `perView` and `focusAt` settings. Running distance
            // should end before creating an empty space after instance.
            //
            // so, in fact this property is used for detect which slide can be latest in active sate
            const last = length - 1;
            if (this.isBound()) {
                const availableSize =
                    Components.Sizes.width -
                    (Components.Peek.value.before + Components.Peek.value.after ||
                        Components.Peek.value * 2);
                let sumWidth = 0;
                for (let i = last; i >= 0; i--) {
                    const _width = Components.Sizes.getCurrentSlideWidth(i);
                    if (_width + sumWidth <= availableSize) {
                        sumWidth += _width + Components.Gaps.value;
                    } else {
                        return i + 1;
                    }
                }
                return 0;
            }

            return last;
        },
    });

    define(Run, 'offset', {
        /**
         * Gets status of the offsetting flag.
         *
         * @return {Boolean}
         */
        get() {
            return this._o;
        },
    });

    return Run;
};

export default _Run;
