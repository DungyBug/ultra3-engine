import AbstractTransporter from "../contracts/services/transporter/abstract-transporter";

class Transport {
    private transporter: AbstractTransporter;
    private address: string;

    constructor(transporter: AbstractTransporter, address: string = "") {
        this.transporter = transporter;
        this.transporter.on("error", this.handleError);
        this.address = address;
    }

    send<T extends true | false>(message: string, waitForResponse: T, to: string = this.address): T extends true ? Promise<string> : void {
        return this.transporter.send<T>({data: message, to}, waitForResponse);
    }

    onMessage(callback: (message: string) => Promise<string> | void) {
        this.transporter.on("message", callback);
    }

    handleError(error: string) {
        console.error("Transport: ", error);
    }
}

export default Transport;