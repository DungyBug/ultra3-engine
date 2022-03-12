/**
 * Abstract class of Transporter
 * Transporter should can send and recieve data from some data interface ( e.g. TCP transporter, USB transporter, Local ( in-app ) transporter ).
 * Also there is events in transporter, such as "error" and "message".
 */

import { EventEmitter } from "../../../services/event-emitter";

interface ISendOpts {
    data: string;
    to?: string | number;
}

type Events = "message" | "error" | "ready";
export type ServerEvents = Events | "connection" | "disconnection" | "request";

type EventCallback<T extends ServerEvents> = T extends "message"
    ? (
          message: string,
          res: (message: any) => void,
          from: number
      ) => Promise<string> | void
    : T extends "error"
    ? (error: string) => void
    : T extends "ready"
    ? () => void
    : T extends "connection" | "disconnection" | "request"
    ? (connectionID: number) => boolean | void
    : never;

abstract class AbstractTransporter<
    T extends string = Events
> extends EventEmitter<Events | T> {
    /**
     * Send a request or just a message to the server
     * @param opts - send options
     * @param waitForResponse - If true, a promise will be returned and transporter will wait for response from server
     */
    abstract send<T extends true | false>(
        opts: ISendOpts,
        waitForResponse?: T
    ): T extends true ? Promise<string> : void;

    abstract get state(): "ready" | "notready";

    // Events
    on<E extends T | Events>(
        event: E,
        callback: E extends Events
            ? EventCallback<E>
            : (...args: Array<unknown>) => unknown
    ) {
        super.on(event, callback);
    }
}

export default AbstractTransporter;
