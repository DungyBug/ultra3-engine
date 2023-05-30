import AbstractTransporter, { AbstractTransporterEvents } from "../../../core/contracts/services/transporter/abstract-transporter";
import WSMessage from "../../../core/contracts/services/transporter/ws/ws-message";
import WSQueueElement from "../../../core/contracts/services/transporter/ws/ws-queue-element";
import { WebSocketServer, WebSocket, RawData } from "ws";
import * as http from "http";
import * as https from "https";
import { IWSSendOpts, IWSSendToAllOpts } from "../../contracts/ws-send-opts";

type WSTrnasporterEvents = {
    "connection": [number];
    "disconnection": [number];
} & AbstractTransporterEvents;

class WSTransporter extends AbstractTransporter<WSTrnasporterEvents> {
    private ws: WebSocketServer;
    private connections: Array<{
        ip: string;
        calls: number;
        ws: WebSocket;
        queue: WSQueueElement[];
    }>;
    private freeAddresses: Array<number>; // Array of indexes, that were freed somewhen and are available now in connections array

    constructor(server: http.Server | https.Server) {
        super();
        this.ws = new WebSocketServer({
            server: server
        });

        this.connections = [];
        this.freeAddresses = [];

        this.ws.on("connection", this.handleConnection.bind(this));
    }

    get state(): "ready" {
        return "ready";
    }

    send<T extends boolean, U extends IWSSendOpts>(
        opts: U,
        waitForResponse?: U extends IWSSendToAllOpts ? never : T
    ): T extends true ? Promise<string> : void {
        const to = opts.to; // just to make typescript a little bit smarter

        if (to === undefined) {
            // Send to all

            for (const connection of this.connections) {
                connection.ws.send(opts.data);
            }

            return undefined as T extends true ? Promise<string> : void;
        } else if (this.connections[to] !== undefined) {
            const connection = this.connections[to];

            if(connection === undefined) {
                throw new Error(`BUG: Connection with id ${to} was not found!`);
            }

            // Won't pass even if "undefined"
            if (waitForResponse) {
                return <T extends true ? Promise<string> : void>(
                    new Promise<string>((res) => {
                        connection.queue.push({
                            id: connection.calls + 1,
                            res
                        })
                        connection.ws.send(
                            JSON.stringify({
                                id: connection.calls + 1, // We add 1 to prevent sending messages with id 0 ( id 0 means that message is no-reply )
                                type: "request",
                                data: opts.data,
                            })
                        );

                        connection.calls++;
                    })
                );
            }

            connection.ws.send(
                JSON.stringify({
                    id: 0,
                    type: "request",
                    data: opts.data,
                })
            );

            return undefined as T extends true ? Promise<string> : void;
        } else {
            // Won't pass even if "undefined"
            if (waitForResponse) {
                return <T extends true ? Promise<string> : void>(
                    new Promise((res, rej) => rej("no such client"))
                );
            }
            
            return undefined as T extends true ? Promise<string> : void;
        }
    }

    private handleError(e: Error) {
        this.emit("error", e);
    }

    handleConnection(connection: WebSocket, message: http.IncomingMessage) {
        // Take queue and calls number out, to make unique queues and ids for every client ( so client 1 can't answer to request for client 2 )
        const queue: WSQueueElement[] = [];
        let disconnected = false;

        // Pick connection id from first address in freeAddresses array if available, otherwise pick a new id
        const connectionID = this.freeAddresses.shift() ?? this.connections.length;

        this.emit("connection", connectionID);

        this.connections[connectionID] = {
            ws: connection,
            queue,
            ip: message.socket.remoteAddress || "0.0.0.0",
            calls: 0,
        };

        connection.on("error", (err: Error) => {
            // Check if client have already been disconnected
            if (!disconnected) {
                disconnected = true;
                this.emit("disconnection", connectionID);

                delete this.connections[connectionID];

                this.freeAddresses.push(connectionID);
                this.handleError(err);
            }
        });

        connection.on("close", () => {
            // Check if client have already been disconnected
            if (!disconnected) {
                disconnected = true;
                this.emit("disconnection", connectionID);

                delete this.connections[connectionID];

                this.freeAddresses.push(connectionID);
            }
        });

        connection.on("message", (data: RawData, isBinary: boolean) => {
            if(isBinary) {
                return;
            }

            const res = JSON.parse(data.toString()) as WSMessage;
            const id = res.id;

            if(res.type === "request") {
                const answer =
                    res.id === 0
                        ? (_data: any) => (undefined)
                        : (data: any) => {
                            const message: WSMessage = {
                                id: res.id,
                                type: "answer",
                                data: data,
                            };
                            connection.send(JSON.stringify(message));
                        };

                this.emit("message", res.data, answer, connectionID);
            } else {
                for(const queueElement of queue) {
                    if(queueElement.id !== id) {
                        continue;
                    }

                    queueElement.res(res.data);
                    queue.splice(queue.indexOf(queueElement), 1);
                    
                    break;
                }
            }
        });
    }
}

export default WSTransporter;
