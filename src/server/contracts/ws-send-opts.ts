export interface IWSSendOpts {
    data: string;
    to: number;
}

export interface IWSSendToAllOpts {
    to?: never;
    data: string;
}
