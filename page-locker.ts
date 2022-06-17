export enum lockClasses {
    simple = 'is-blocked',
    ios = 'is-blocked-touch'
}

export class PageLocker {
    private _initialScrollPosition = 0;

    private _retainers: { [id: string]: boolean } = {};

    private _isLocked = false;

    private _target = document.documentElement;

    private _isIOS: boolean;

    private _lockedClass: string;

    constructor() {
        this._isIOS = !!navigator.platform.match(/iPhone|iPod|iPad/);
        this._lockedClass = this._isIOS ? lockClasses.ios : lockClasses.simple;
    }

    public lock = (id: string): void => {
        this._retainers[id] = true;
        const { _target, _isIOS, _lockedClass } = this;
        if (!this._isLocked) {
            if (_isIOS) {
                // save current scroll position in order to restore it after unlock
                this._initialScrollPosition = window.pageYOffset;
                _target.style.top = -this._initialScrollPosition + 'px';
            }
            _target.classList.add(_lockedClass);
            this._isLocked = true;
        }
    };

    public unlock = (id: string): void => {
        this._retainers[id] = false;
        if (this._isUnlocked() && this._isLocked) {
            const { _target, _isIOS, _lockedClass } = this;
            _target.classList.remove(_lockedClass);
            if (_isIOS) {
                _target.style.top = '';
                _target.scrollTo(0, this._initialScrollPosition);
            }
            this._isLocked = false;
        }
    };

    private _isUnlocked = (): boolean =>
        Object.keys(this._retainers).every((key) => this._retainers[key] === false);
}
