import { setStyles } from '@ofigelov/dynamic-style-service';

const ID = 'scrollbar';

const getScrollbarSize = (): number => {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText =
        'width: 99px; height: 99px; overflow: scroll; position: absolute; visibility: hidden;';
    document.body.appendChild(scrollDiv);
    const scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarSize;
};


export const setScrollBarSize = () => {
    let size = window.sessionStorage.getItem(ID);
    if (size === null) {
        size = getScrollbarSize().toString();
        window.sessionStorage.setItem(ID, size);
    }
    setStyles({
        id: ID,
        selector: '.body',
        css: `--${ID}: ${size}px;`,
    });
}
