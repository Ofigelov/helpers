export class SubscribeService<T> {
    private _subscribers: { [id: string]: (serviceArgument?: T) => void } = {};

    public subscribe = (id: string, cb: (serviceArgument?: T) => void) => {
        this._subscribers[id] = cb;
    };

    public unsubscribe = (id: string): void => {
        if (id && this._subscribers[id]) delete this._subscribers[id];
    };

    public emit = (id?: string, serviceArgument?: T): void => {
        Object.keys(this._subscribers).forEach((key) => {
            if (key !== id) this._subscribers[key](serviceArgument);
        });
    };
}
