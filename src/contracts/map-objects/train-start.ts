import { IBaseTrain } from "./train";

export interface ITrainStart extends IBaseTrain {
    readonly end: true;
    next(): IBaseTrain;
    getNodesList(): Array<IBaseTrain>;
}