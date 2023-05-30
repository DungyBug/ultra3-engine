import AbstractTransporter from "../contracts/services/transporter/abstract-transporter";
import TransportQueue from "../contracts/services/transporter/transport-queue";

class Transport {
    private transporter: AbstractTransporter;
    private address: string;
    private queue: TransportQueue;

    constructor(transporter: AbstractTransporter, address: string = "") {
        this.transporter = transporter;
        this.transporter.on("error", this.handleError);
        this.transporter.on("ready", this.handleReadyState.bind(this));
        this.address = address;
        this.queue = [];
    }

    private handleReadyState() {
        for (let q of this.queue) {
            if (q.waitForResponse) {
                this.transporter
                    .send<true>({ data: q.message, to: q.to }, true)
                    .then(q.res);
            } else {
                this.transporter.send<false>(
                    { data: q.message, to: q.to },
                    false
                );
            }
        }
    }

    send<T extends true | false>(
        message: string,
        waitForResponse: T,
        to: string = this.address
    ): T extends true ? Promise<string> : void {
        if (this.transporter.state === "ready") {
            return this.transporter.send<T>(
                { data: message, to },
                waitForResponse
            );
        }
        // Send message when transporter will be ready

        if (waitForResponse) {
            return <T extends true ? Promise<string> : void>(
                new Promise<string>((res) => {
                    this.queue.push({
                        waitForResponse: true,
                        res,
                        to,
                        message,
                    });
                })
            );
        }

        this.queue.push({
            waitForResponse: false,
            to,
            message,
        });

        return undefined as T extends true ? Promise<string> : void;
    }

    onMessage(
        callback: (
            message: string,
            res: (message: string) => void,
            from: number
        ) => Promise<string> | void
    ) {
        this.transporter.on("message", callback);
    }

    handleError(error: string | Error) {
        console.error("Transport: ", error);
    }
}

export default Transport;
