interface DontWaitForResponseTransportQueue {
    message: string;
    waitForResponse: false;
    to: string;
};

interface WaitForResponseTransportQueue {
    message: string;
    waitForResponse: true;
    to: string;
    res: (data: string) => void;
};

type TransportQueue = Array<DontWaitForResponseTransportQueue | WaitForResponseTransportQueue>;

export default TransportQueue;