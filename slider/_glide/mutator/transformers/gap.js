/**
 * Updates glide movement with a `gap` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
export default function gap(Glide, Components) {
    return {
        /**
         * Modifies passed translate value with number in the `gap` settings.
         *
         * @param  {Number} translate
         * @return {Number}
         */
        modify(translate) {
            const multiplier = Components.Html.slides.reduce(
                (val, slide, index) => (index < Glide.index ? val + Components.Gaps.value : val),
                0
            );
            return translate + multiplier;
        },
    };
}
