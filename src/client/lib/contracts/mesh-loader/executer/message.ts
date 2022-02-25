interface IExecuterBaseMessage {
    type: "callfunc" | "setprop" | "readprop" | "message";
    id: number;
}

interface IExecuterCallFuncMessage extends IExecuterBaseMessage {
    type: "callfunc";
    funcname: string;
    args: Array<any>;
}

interface IExecuterSetPropMessage extends IExecuterBaseMessage {
    type: "setprop";
    propname: string;
    newvalue: any;
}

interface IExecuterGetPropMessage extends IExecuterBaseMessage {
    type: "readprop";
    propname: string;
}

interface IExecuterMessage extends IExecuterBaseMessage {
    type: "message";
}

type ExecuterMessage = IExecuterCallFuncMessage | IExecuterGetPropMessage | IExecuterMessage | IExecuterSetPropMessage;

export default ExecuterMessage;