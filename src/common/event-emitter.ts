export class EventEmitter {
    protected callbacks: any;

    constructor() {
        this.callbacks = {};
    }

    on(event: string, callback: (...args: any) => any) {
        if(this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event].push(callback);
        } else {
            this.callbacks[event] = [callback];
        }
    }

    emit(event: string, ...args: any): Array<any> {
        let results: Array<any> = [];

        if(this.callbacks.hasOwnProperty("all")) {
            for(let i = 0; i < this.callbacks.all.length; i++) {
                results.push(this.callbacks.all[i](args));
            }
        }

        if(!this.callbacks.hasOwnProperty(event)) {
            return results;
        }

        for(let i = 0; i < this.callbacks[event].length; i++) {
            results.push(this.callbacks[event][i](args));
        }

        return results;
    }
}