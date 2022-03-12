import AbstractTransporter from "../../../core/contracts/services/transporter/abstract-transporter";
import WSMessage from "../../../core/contracts/services/transporter/ws/ws-message";
import WSQueue from "../../../core/contracts/services/transporter/ws/ws-queue";

type WSURL = `ws${"s" | ""}://${string}`;

interface IWSSendOpts {
    data: string;
    to: "";
}

class WSTransporter extends AbstractTransporter {
    private address: WSURL;
    private ws: WebSocket;
    private queue: WSQueue;
    private calls: number;

    constructor(address: WSURL) {
        super();
        this.address = address;
        this.ws = new WebSocket(address);
        this.ws.onerror = this.handleError.bind(this);
        this.ws.onmessage = this.handleMessage.bind(this);
        this.ws.onopen = () => this.emit("ready");
        this.queue = [];
        this.calls = 1; // To prevent sending messages with id 0 ( id 0 means that message is no-reply )
    }

    get state() {
        if (this.ws.readyState === 1) {
            return "ready";
        }

        return "notready";
    }

    send<T extends boolean>(
        opts: IWSSendOpts,
        waitForResponse: T
    ): T extends true ? Promise<string> : void {
        if (waitForResponse) {
            return <T extends true ? Promise<string> : void>(
                new Promise<string>((res) => {
                    this.queue[this.calls] = res;
                    this.ws.send(
                        JSON.stringify({
                            id: this.calls,
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
    }

    private handleError(e: Event) {
        this.emit("error", e);
    }

    private handleMessage(e: MessageEvent<any>) {
        const res = JSON.parse(e.data) as WSMessage;
        const id = res.id;

        const item = this.queue[id];

        if (res.type === "request") {
            let answer;

            if (res.id === 0) {
                // Do not answer messages with "id" 0
                answer = function (_data: any) {};
            } else {
                answer = (data: any) => {
                    const message: WSMessage = {
                        id: res.id,
                        type: "answer",
                        data: data,
                    };
                    this.ws.send(JSON.stringify(message));
                };
            }

            this.emit("message", res.id, answer);
        } else if (item) {
            item(res.data);
            this.queue[id] = undefined;
        }
    }
}

export default WSTransporter;
