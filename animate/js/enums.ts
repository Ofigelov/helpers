import { iFactorials } from './clip-animation';

const BOTTOM_TO_TOP: iFactorials = {
    steps: ['0', '100'],
    left: {
        0: { v: 0 },
        100: { v: 0 },
    },
    right: {
        0: { v: 1 },
        100: { v: 1 },
    },
    top: {
        0: { v: 1 },
        100: { v: 0 },
    },
    bottom: {
        0: { v: 1 },
        100: { v: 1 },
    },
};

const RIGHT_TO_LEFT: iFactorials = {
    steps: ['0', '100'],
    left: {
        0: { v: 1 },
        100: { v: 0 },
    },
    right: {
        0: { v: 1 },
        100: { v: 1 },
    },
    top: {
        0: { v: 0 },
        100: { v: 0 },
    },
    bottom: {
        0: { v: 1 },
        100: { v: 1 },
    },
};

const LEFT_TO_RIGHT: iFactorials = {
    steps: ['0', '100'],
    left: {
        0: { v: 0 },
        100: { v: 0 },
    },
    right: {
        0: { v: 0 },
        100: { v: 1 },
    },
    top: {
        0: { v: 0 },
        100: { v: 0 },
    },
    bottom: {
        0: { v: 1 },
        100: { v: 1 },
    },
};

const imagesFactorials = Object.freeze({
    BOTTOM_TO_TOP,
    RIGHT_TO_LEFT,
    LEFT_TO_RIGHT,
});

const defaultValues = Object.freeze({
    TIMEOUT_IMAGE_LOAD: 2000,
    BLOCK_DELAY: 500,
    BLOCK_STEP: 250,
    CLIP_STEP: 350,
    CLIP_DURATION: 800,
    TITLE_STEP: 250,
    TITLE_DURATION: 800,
    OPTIONS_ATTR: 'data-options',
});

const cssClasses = Object.freeze({
    ACTIVE: 'is-active-animation',
    FADE_OUT: 'fade-out',
    FINISHED: 'is-finished-animation',
});

export { cssClasses, imagesFactorials, defaultValues };
