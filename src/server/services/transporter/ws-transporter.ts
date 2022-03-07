import AbstractTransporter from "../../../core/contracts/services/transporter/abstract-transporter";
import WSMessage from "../../../core/contracts/services/transporter/ws/ws-message";
import WSQueue from "../../../core/contracts/services/transporter/ws/ws-queue";
import * as WS from "websocket";
import * as http from "http";

type IP = `${number}.${number}.${number}.${number}`;

interface IWSSendOpts {
    data: string;
    to: IP;
}

class WSTransporter extends AbstractTransporter {
    private ws: WS.server;
    private calls: { [K: IP]: number };
    private connections: {
        [K: IP]: {
            ws: WS.connection;
            queue: WSQueue;
        };
    };

    constructor(httpServer: http.Server) {
        super();
        this.ws = new WS.server({
            httpServer,
            maxReceivedFrameSize: 64 * 1024, // 64KB
            maxReceivedMessageSize: 16 * 1024 * 1024, // 16MB
            keepalive: true,
            keepaliveInterval: 30000, // 30 secs
            dropConnectionOnKeepaliveTimeout: true,
            keepaliveGracePeriod: 40000, // 40 secs
            useNativeKeepalive: false,
            autoAcceptConnections: true,
            ignoreXForwardedFor: false,
        });

        this.calls = {};
        this.connections = {};

        this.ws.on("connect", this.handleConnection.bind(this));
    }

    get state(): "ready" {
        return "ready";
    }

    send<T extends boolean>(
        opts: IWSSendOpts,
        waitForResponse: T
    ): T extends true ? Promise<string> : void {
        if (this.connections[opts.to] !== undefined) {
            if (waitForResponse) {
                return <T extends true ? Promise<string> : void>(
                    new Promise<string>((res) => {
                        this.connections[opts.to].queue[
                            this.calls[opts.to] + 1
                        ] = res;
                        this.connections[opts.to].ws.send(
                            JSON.stringify({
                                id: this.calls[opts.to] + 1, // We add 1 to prevent sending messages with id 0 ( id 0 means that message is no-reply )
                                type: "request",
                                data: opts.data,
                            })
                        );

                        this.calls[opts.to]++;
                    })
                );
            }

            this.connections[opts.to].ws.send(
                JSON.stringify({
                    id: 0,
                    type: "request",
                    data: opts.data,
                })
            );
        } else {
            if (waitForResponse) {
                return <T extends true ? Promise<string> : void>(
                    new Promise((res, rej) => rej("No such IP."))
                );
            }
        }
    }

    private handleError(e: Error) {
        this.emit("error", e);
    }

    handleConnection(connection: WS.connection) {
        // Take queue and calls number out, to make unique queues and ids for every client ( so client 1 can't answer to request for client 2 )
        const queue: WSQueue = {};

        this.connections[<IP>connection.remoteAddress] = {
            ws: connection,
            queue: queue,
        };

        this.calls[<IP>connection.remoteAddress] = 0;

        connection.on("error", (err: Error) => {
            this.connections[<IP>connection.remoteAddress] = undefined;
            this.calls[<IP>connection.remoteAddress] = undefined;
            this.handleError(err);
        });

        connection.on("close", (code: number, desc: string) => {
            this.connections[<IP>connection.remoteAddress] = undefined;
            this.calls[<IP>connection.remoteAddress] = undefined;
        });

        connection.on("message", (data: WS.Message) => {
            if (data.type === "utf8") {
                const res = JSON.parse(data.utf8Data) as WSMessage;
                const id = res.id;

                const item = queue[id];

                if (res.type === "request") {
                    let answer;

                    if (res.id === 0) {
                        answer = function (_data: any) {};
                    } else {
                        answer = (data: any) => {
                            const message: WSMessage = {
                                id: res.id,
                                type: "answer",
                                data: data,
                            };
                            connection.send(JSON.stringify(message));
                        };
                    }

                    this.emit("message", res.data, answer);
                } else if (item) {
                    item(res.data);
                    queue[id] = undefined;
                }
            }
        });
    }
}

export default WSTransporter;
