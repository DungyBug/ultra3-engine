import AbstractTransporter from "../../../core/contracts/services/transporter/abstract-transporter";
import WSMessage from "../../../core/contracts/services/transporter/ws/ws-message";
import WSQueueElement from "../../../core/contracts/services/transporter/ws/ws-queue-element";

type WSURL = `ws${"s" | ""}://${string}`;

interface IWSSendOpts {
    data: string;
    to?: "";
}

class WSTransporter extends AbstractTransporter {
    private address: WSURL;
    private ws: WebSocket;
    private queue: WSQueueElement[];
    private calls: number;

    constructor(address: WSURL) {
        super();
        this.address = address;
        this.ws = new WebSocket(address);
        this.ws.onerror = this.handleError.bind(this);
        this.ws.onmessage = this.handleMessage.bind(this);
        this.ws.onopen = () => this.emit("ready");
        this.queue = [];
        this.calls = 0;
    }

    get state() {
        if (this.ws.readyState === 1) {
            return "ready";
        }

        return "notready";
    }

    send<T extends boolean>(
        opts: IWSSendOpts,
        waitForResponse?: T
    ): T extends true ? Promise<string> : void {
        if (waitForResponse) {
            return <T extends true ? Promise<string> : void>(
                new Promise<string>((res) => {
                    this.queue.push({
                        id: this.calls + 1, // To prevent sending messages with id 0 ( id 0 means that message is no-reply )
                        res
                    });

                    this.ws.send(
                        JSON.stringify({
                            id: this.calls + 1,
                            type: "request",
                            data: opts.data,
                        })
                    );
                    this.calls++;
                })
            );
        }

        this.ws.send(
            JSON.stringify({
                id: 0, // The null ID is used to "mark" message as no-reply
                type: "request",
                data: opts.data,
            })
        );

        return undefined as T extends true ? Promise<string> : void;
    }

    private handleError(e: Event) {
        this.emit("error", new Error("An error has occurred."));
    }

    private handleMessage(e: MessageEvent<any>) {
        const res = JSON.parse(e.data) as WSMessage;
        const id = res.id;


        switch(res.type) {
            case "broadcast": {
                this.emit("message", res.data, (_data: unknown) => undefined, res.id);
                break;
            }

            case "request": {
                const answer = 
                    res.id === 0
                        ? (_data: unknown) => undefined
                        : (data: unknown) => {
                            const message: WSMessage = {
                                id: res.id,
                                type: "answer",
                                data
                            }
    
                            this.ws.send(JSON.stringify(message));
                        };
    
                this.emit("message", res.data, answer, res.id);
                break;
            }

            case "answer": {
                for(const queueElement of this.queue) {
                    if(queueElement.id !== id) {
                        continue;
                    }
    
                    queueElement.res(res.data);
                    this.queue.splice(this.queue.indexOf(queueElement), 1);   
                    break;
                }
                break;
            }
        }
    }
}

export default WSTransporter;
