type IAvailabilityFlag = any | null;

export class ScriptLoader {
    private isLoaded = false;

    private isLoading = false;

    private callbacks: CallableFunction[] = [];

    private src: string;

    private flag: IAvailabilityFlag;

    constructor(src: string, flag: IAvailabilityFlag = null) {
        this.src = src;
        this.flag = flag;
    }

    public load = (): void => {
        if (!this.isLoading && !this.isLoaded) {
            this.isLoading = true;
            const script = document.createElement('script');
            script.async = true;
            script.defer = true;
            script.src = this.src;
            script.onload = () => {
                if (this.flag === null) {
                    setTimeout(this.setLoaded, 150);
                } else {
                    const timer = window.setInterval(() => {
                        if (this.flag) {
                            window.clearInterval(timer);
                            this.setLoaded();
                        }
                    }, 10);
                }
            };
            document.body.appendChild(script);
        }
    };

    private setLoaded = () => {
        this.isLoaded = true;
        this.isLoading = false;
        this.callbacks.forEach((cb) => cb());
    };

    public onReady = (cb: CallableFunction): void => {
        if (!this.isLoading && !this.isLoaded) this.load();
        if (this.isLoaded) {
            cb();
        } else {
            this.callbacks.push(cb);
        }
    };
}
