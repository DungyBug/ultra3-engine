import AbstractTransporter from "../../contracts/services/transporter/abstract-transporter";

type URL = `${'http' | 'ftp'}${'s' | ''}://${string}`;

interface IHTTPSendOpts {
    data: string,
    to: URL
}

class HTTPTransporter extends AbstractTransporter {
    constructor() {
        super();
    }

    send<T extends true | false>(opts: IHTTPSendOpts, waitForResponse: T): T extends true ? Promise<string> : void {
        const response = fetch(opts.to, {
            method: "POST",
            body: opts.data
        });

        if(waitForResponse === true) {
            // We need to cast here, as typescript don't understand here, what type exactly should been returned
            return <T extends true ? Promise<string> : void>response.then(x => x.text());
        } else {
            // Catch error if occured
            response
                .then(x => x.text())
                .catch((err: any) => {
                    this.emit("error", err.toString());
                })
        }
    }
}

export default HTTPTransporter;