import EventsBinder from '../core/event/events-binder';

const _Keyboard = function (Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    const Binder = new EventsBinder();

    const compensateScroll = () => {
        /*
         * Yeah, we have "overflow: hidden;" on track element,
         * but if we try to change slides by pressing "tab",
         * scroll position is changed by native browser logic.
         * unfortunately we dont have the way to prevent only scroll effect,
         * so we will just redefine it's value to zero state;
         * */
        Components.Html.track.scrollLeft = 0;
    };

    const Keyboard = {
        /**
         * Binds keyboard events on component mount.
         *
         * @return {Void}
         */
        mount() {
            if (Glide.settings.keyboard) {
                this.bind();
            }
        },

        /**
         * Adds keyboard press events.
         *
         * @return {Void}
         */
        bind() {
            Binder.on('keyup', document, this.press);
            Binder.on('scroll', Components.Html.track, compensateScroll);
        },

        /**
         * Removes keyboard press events.
         *
         * @return {Void}
         */
        unbind() {
            Binder.off('keyup', document);
            Binder.off('scroll', Components.Html.track);
        },

        /**
         * Handles keyboard's arrows press and moving glide forward and backward.
         *
         * @param  {Object} event
         * @return {Void}
         */
        press(event) {
            const { perSwipe } = Glide.settings;

            if (event.keyCode === 39) {
                Components.Run.make(Components.Direction.resolve(`${perSwipe}>`));
            }

            if (event.keyCode === 37) {
                Components.Run.make(Components.Direction.resolve(`${perSwipe}<`));
            }

            if (event.keyCode === 9 && Components.Html.root.contains(document.activeElement)) {
                const index = Components.Html.slides.findIndex((slide) =>
                    slide.contains(document.activeElement)
                );
                if (index >= 0) {
                    const realTranslate =
                        (Components.Peek.value.before || Components.Peek.value) -
                        Components.Move.translate;
                    let pos = Components.Html.slides.reduce((val, slide, i) => {
                        return i < index
                            ? val + Components.Sizes.getCurrentSlideWidth(i) + Components.Gaps.value
                            : val;
                    }, 0);
                    const rightPos = Components.Sizes.getCurrentSlideWidth(index) + pos;
                    if (
                        realTranslate + pos < 0 ||
                        Components.Sizes.width - realTranslate < rightPos
                    ) {
                        Components.Run.make(`=${index}`);
                    }
                }
            }
        },
    };

    /**
     * Remove bindings from keyboard:
     * - on destroying to remove added events
     * - on updating to remove events before remounting
     */
    Events.on(['destroy', 'update'], () => {
        Keyboard.unbind();
    });

    /**
     * Remount component
     * - on updating to reflect potential changes in settings
     */
    Events.on('update', () => {
        Keyboard.mount();
    });

    /**
     * Destroy binder:
     * - on destroying to remove listeners
     */
    Events.on('destroy', () => {
        Binder.destroy();
    });

    return Keyboard;
};

export default _Keyboard;
