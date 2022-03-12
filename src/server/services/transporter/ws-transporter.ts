import AbstractTransporter, {
    ServerEvents,
} from "../../../core/contracts/services/transporter/abstract-transporter";
import WSMessage from "../../../core/contracts/services/transporter/ws/ws-message";
import WSQueue from "../../../core/contracts/services/transporter/ws/ws-queue";
import * as WS from "websocket";
import * as http from "http";
import { IWSSendOpts, IWSSendToAllOpts } from "../../contracts/ws-send-opts";

class WSTransporter extends AbstractTransporter<ServerEvents> {
    private ws: WS.server;
    private connections: Array<{
        ip: string;
        calls: number;
        ws: WS.connection;
        queue: WSQueue;
    }>;
    private freeAddresses: Array<number>; // Array of indexes, that were freed somewhen and are available now in connections array

    constructor(httpServer: http.Server) {
        super();
        this.ws = new WS.server({
            httpServer,
            maxReceivedFrameSize: 64 * 1024, // 64KB
            maxReceivedMessageSize: 16 * 1048576, // 16MB
            keepalive: true,
            keepaliveInterval: 30000, // 30 secs
            dropConnectionOnKeepaliveTimeout: true,
            keepaliveGracePeriod: 40000, // 40 secs
            useNativeKeepalive: false,
            autoAcceptConnections: false,
            ignoreXForwardedFor: false,
        });

        this.connections = [];
        this.freeAddresses = [];

        this.ws.on("connect", this.handleConnection.bind(this));
        this.ws.on("request", this.handleRequest.bind(this));
    }

    get state(): "ready" {
        return "ready";
    }

    send<T extends boolean, U extends IWSSendOpts>(
        opts: U,
        waitForResponse?: U extends IWSSendToAllOpts ? never : T
    ): T extends true ? Promise<string> : void {
        if (!opts.to) {
            // Send to all

            for (const connection of this.connections) {
                connection.ws.send(opts.data);
            }
        } else if (this.connections[opts.to] !== undefined) {
            // Won't pass even if "undefined"
            if (waitForResponse) {
                return <T extends true ? Promise<string> : void>(
                    new Promise<string>((res) => {
                        this.connections[opts.to].queue[
                            this.connections[opts.to].calls + 1
                        ] = res;
                        this.connections[opts.to].ws.send(
                            JSON.stringify({
                                id: this.connections[opts.to].calls + 1, // We add 1 to prevent sending messages with id 0 ( id 0 means that message is no-reply )
                                type: "request",
                                data: opts.data,
                            })
                        );

                        this.connections[opts.to].calls++;
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
            // Won't pass even if "undefined"
            if (waitForResponse) {
                return <T extends true ? Promise<string> : void>(
                    new Promise((res, rej) => rej("No such client."))
                );
            }
        }
    }

    private handleError(e: Error) {
        this.emit("error", e);
    }

    handleRequest(connection: WS.request) {
        const connectionID = this.freeAddresses.length
            ? this.freeAddresses.shift()
            : this.connections.length;

        const results = this.emit("request", connectionID);

        for (const result of results) {
            if (result === false) {
                this.freeAddresses.push(connectionID);
                connection.reject();
                return;
            }
        }

        connection.accept();
    }

    handleConnection(connection: WS.connection) {
        // Take queue and calls number out, to make unique queues and ids for every client ( so client 1 can't answer to request for client 2 )
        const queue: WSQueue = {};
        let disconnected = false;

        // Pick connection id from first address in freeAddresses array if available, otherwise pick a new id
        const connectionID = this.freeAddresses.length
            ? this.freeAddresses.shift()
            : this.connections.length;

        this.emit("connection", connectionID);

        this.connections[connectionID] = {
            ws: connection,
            queue: queue,
            ip: connection.remoteAddress,
            calls: 0,
        };

        connection.on("error", (err: Error) => {
            // Check if client have already been disconnected
            if (!disconnected) {
                disconnected = true;
                this.emit("disconnection", connectionID);
                this.connections[connectionID] = undefined;
                this.freeAddresses.push(connectionID);
                this.handleError(err);
            }
        });

        connection.on("close", (code: number, desc: string) => {
            // Check if client have already been disconnected
            if (!disconnected) {
                disconnected = true;
                this.emit("disconnection", connectionID);
                this.connections[connectionID] = undefined;
                this.freeAddresses.push(connectionID);
            }
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

                    this.emit("message", res.data, answer, connectionID);
                } else if (item) {
                    item(res.data);
                    queue[id] = undefined;
                }
            }
        });
    }
}

export default WSTransporter;
