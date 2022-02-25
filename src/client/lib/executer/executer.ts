import { EventEmitter } from "../../../core/services/event-emitter";
import IExecuter from "../contracts/mesh-loader/executer/executer";
import IExecuterInstance from "../contracts/mesh-loader/executer/instance";
import ExecuterMessage from "../contracts/mesh-loader/executer/message";

class Executer extends EventEmitter<"message" | "error"> implements IExecuter {
    private instance: IExecuterInstance;
    private url: string;
    private worker: Worker;

    constructor(source: IExecuterInstance) {
        super();
        this.instance = source;
        this.url = `data:text/javascript;base64,${btoa(source.source)}`;
    }

    execute(): void {
        this.worker = new Worker(this.url);
        this.worker.onmessage = this.handleMessage.bind(this);
        this.worker.onerror = (ev: ErrorEvent) => this.emit("error", ev);
    }

    handleMessage(ev: MessageEvent<any>): void {
        const data = JSON.parse(ev.data) as ExecuterMessage;

        switch(data.type) {
            case "callfunc": {
                const keys = data.funcname.split('.');
                let obj = this.instance.environment;

                for(let key of keys) {
                    if(obj.hasOwnProperty(key)) {
                        obj = obj[key];
                    } else {
                        obj = null;
                        break;
                    }
                }

                if(obj !== null && typeof obj === "function") {
                    this.worker.postMessage(JSON.stringify({
                        id: data.id,
                        value: JSON.stringify(obj(...data.args)),
                        success: true
                    }));
                } else {
                    this.worker.postMessage(JSON.stringify({
                        id: data.id,
                        value: null,
                        success: false
                    }));
                }
                
                break;
            }
            case "readprop": {
                const keys = data.propname.split('.');
                let obj = this.instance.environment;

                for(let key of keys) {
                    if(obj.hasOwnProperty(key)) {
                        obj = obj[key];
                    } else {
                        obj = null;
                        break;
                    }
                }

                if(obj !== null) {
                    this.worker.postMessage(JSON.stringify({
                        id: data.id,
                        value: obj,
                        success: true
                    }));
                } else {
                    this.worker.postMessage(JSON.stringify({
                        id: data.id,
                        value: null,
                        success: false
                    }));
                }

                break;
            }
            case "setprop": {
                const keys = data.propname.split('.');
                let obj = this.instance.environment;

                for(let key of keys.slice(0, -1)) {
                    if(obj.hasOwnProperty(key)) {
                        obj = obj[key];
                    } else {
                        obj = null;
                        break;
                    }
                }

                if(obj !== null) {
                    obj[keys[keys.length-1]] = JSON.parse(data.newvalue);
                    this.worker.postMessage(JSON.stringify({
                        id: data.id,
                        success: true
                    }));
                } else {
                    this.worker.postMessage(JSON.stringify({
                        id: data.id,
                        success: false
                    }));
                }

                break;
            }
            case "message": {
                this.emit("message", data);
                break;
            }
        }
    }
}

export default Executer;