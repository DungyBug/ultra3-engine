import ICompiler from "../contracts/mesh-loader/executer/compiler";
import ICompilerOptions from "../contracts/mesh-loader/executer/compiler-opts";
import IExecuterInstance from "../contracts/mesh-loader/executer/instance";

/**
 * Basic compiler, that simply adds code to the script and realises simple communication
 * interface.
 */

class Compiler implements ICompiler {
    private entry: string;
    private eventEntry: string;
    private addCode: string;

    constructor(opts: ICompilerOptions) {
        this.entry = opts.entry;
        this.eventEntry = opts.eventEntry;
        this.addCode = opts.addCode || '';
    }

    compile(instance: IExecuterInstance): IExecuterInstance {
        let newSource = `
function ${this.eventEntry}(e) {}
const SYSCALL = (function() {
    let id = 0;
    const queue = [];

    onmessage = function(e) {
        const recv = JSON.parse(e.data);

        if(recv.type === "event") {
            if(typeof ${this.eventEntry} === "function") {
                ${this.eventEntry}(recv.event);
            }
            return;
        }

        for(let i = 0; i < queue.length; i++) {
            if(queue[i].id === recv.id) {
                queue[i].res(recv);
                break;
            }
        }
    }

    return function(name, ...args) {
        return new Promise(res => {
            switch(name) {
                case "readprop": {
                    postMessage(JSON.stringify({
                        id: id,
                        type: "readprop",
                        propname: args[0]
                    }));

                    queue.push({
                        id: id,
                        res: res
                    });
                    id++;
                    break;
                }
                case "callfunc": {
                    postMessage(JSON.stringify({
                        id: id,
                        type: "callfunc",
                        funcname: args[0],
                        args: args.slice(2)
                    }));

                    if(args[1]) {
                        queue.push({
                            id: id,
                            res: res
                        });
                    } else {
                        res();
                    }

                    id++;
                    break;
                }
                case "setprop": {
                    postMessage(JSON.stringify({
                        id: id,
                        type: "setprop",
                        propname: args[0],
                        newvalue: JSON.stringify(args[1])
                    }));
                    res();
                    id++;
                    break;
                }
                case "message": {
                    postMessage(JSON.stringify({
                        id: id,
                        type: "message",
                        message: args[0]
                    }));

                    if(args[1]) {
                        queue.push({
                            id: id,
                            res: res
                        });
                    } else {
                        res();
                    }

                    id++;
                    break;
                }
            }
        });
    }
})();
// To prevent global variables from changing
(function(){
    const postMessage = null;
    const onmessage = null;
    ${this.addCode}
    ${instance.source}
    ${this.entry}();
})();`;

        return {
            environment: instance.environment,
            source: newSource
        }
    }
}

export default Compiler;