export class EventEmitter<V extends Record<string, unknown[]>> {
    protected callbacks: any;

    constructor() {
        this.callbacks = {};
    }

    on<T extends keyof V>(event: T, callback: (...args: V[T]) => void) {
        if (this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event].push(callback);
        } else {
            this.callbacks[event] = [callback];
        }
    }

    emit<T extends keyof V>(event: T, ...args: V[T]): Array<any> {
        let results: Array<any> = [];

        if (this.callbacks.hasOwnProperty("all")) {
            for (let i = 0; i < this.callbacks.all.length; i++) {
                results.push(this.callbacks.all[i](...args));
            }
        }

        if (!this.callbacks.hasOwnProperty(event)) {
            return results;
        }

        for (let i = 0; i < this.callbacks[event].length; i++) {
            results.push(this.callbacks[event][i](...args));
        }

        return results;
    }
}