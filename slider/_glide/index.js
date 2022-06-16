import Core from './core';

// Required components
import Run from './components/run';
import Gaps from './components/gaps';
import Html from './components/html';
import Peek from './components/peek';
import Move from './components/move';
import Sizes from './components/sizes';
import Build from './components/build';
import Clones from './components/clones';
import Resize from './components/resize';
import Direction from './components/direction';
import Translate from './components/translate';
import Transition from './components/transition';

// Optional components
import Swipe from './components/swipe';
import Images from './components/images';
import Anchors from './components/anchors';
import Controls from './components/controls';
import Keyboard from './components/keyboard';
import Autoplay from './components/autoplay';
import Breakpoints from './components/breakpoints';

const COMPONENTS = {
    // Required
    Html,
    Translate,
    Transition,
    Direction,
    Peek,
    Sizes,
    Gaps,
    Move,
    Clones,
    Resize,
    Build,
    Run,

    // Optional
    Swipe,
    Images,
    Anchors,
    Controls,
    Keyboard,
    Autoplay,
    Breakpoints,
};

export default class Glide extends Core {
    mount(extensions = {}) {
        return super.mount({ ...COMPONENTS, ...extensions });
    }
}
