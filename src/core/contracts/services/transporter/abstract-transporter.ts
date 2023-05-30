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

export type AbstractTransporterEvents = {
    "message": [string, (message: any) => void, number];
    "error": [Error | string];
    "ready": [];
}

abstract class AbstractTransporter<T extends {[k: string]: unknown[]} & AbstractTransporterEvents = AbstractTransporterEvents> extends EventEmitter<T> {
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
}

export default AbstractTransporter;
