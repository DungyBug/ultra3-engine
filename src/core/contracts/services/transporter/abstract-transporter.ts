/**
 * Abstract class of Transporter
 * Transporter should can send and recieve data from some data interface ( e.g. TCP transporter, USB transporter, Local ( in-app ) transporter ).
 * Also there is events in transporter, such as "error" and "message". 
 */

import { EventEmitter } from "../../../services/event-emitter";

interface ISendOpts {
    data: string;
    to: string;
}

type Events = "message" | "error" | "ready";

type EventCallback<T extends Events> =
    T extends "message" ?
        (message: string, res: (message: any) => void) => Promise<string> | void
        : T extends "error" ?
            (error: string) => void
            : T extends "ready" ?
                () => void
                : never;

abstract class AbstractTransporter extends EventEmitter<Events> {
    /**
     * Send a request or just a message to the server
     * @param opts - send options
     * @param waitForResponse - If true, a promise will be returned and transporter will wait for response from server
     */
    abstract send<T extends true | false>(opts: ISendOpts, waitForResponse: T): T extends true ? Promise<string> : void;

    abstract get state(): "ready" | "notready";
    
    // Events
    on<E extends Events>(event: E, callback: EventCallback<E>) {
        super.on(event, callback);
    }
}

export default AbstractTransporter;