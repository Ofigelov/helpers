import { SubscribeService } from 'subscribe-service';

interface IVoidFunc {
    cb: () => void;
    node: HTMLElement;
}

class ScrollObserver {
    private subscribers: IVoidFunc[] = [];

    private canBeUsed: boolean;

    private intersectionObserver: IntersectionObserver | null;

    constructor() {
        this.canBeUsed = !!window.IntersectionObserver;

        this.intersectionObserver = this.canBeUsed
            ? new window.IntersectionObserver(
                  (entries) => {
                      entries.forEach((entry) => {
                          if (entry.intersectionRatio <= 0) return;
                          const foundSubscriber = this.subscribers.find(
                              (subscriber) => subscriber.node === entry.target
                          );

                          if (!foundSubscriber) return;

                          foundSubscriber.cb();
                      });
                  },
                  {
                      threshold: [0, 0.25, 0.5, 0.75, 1],
                  }
              )
            : null;
    }

    subscribe(node: HTMLElement, cb: () => void) {
        if (!this.canBeUsed) {
            cb();
            return () => {};
        }
        this.intersectionObserver?.observe(node);
        this.subscribers.push({
            node,
            cb,
        });

        return () => {
            this.subscribers = this.subscribers.filter((subscriber) => subscriber.node !== node);
            this.intersectionObserver?.unobserve(node);
        };
    }
}

export const scrollObserver = new ScrollObserver();
