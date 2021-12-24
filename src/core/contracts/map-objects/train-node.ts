import { IBaseTrain } from "./train";

export interface ITrainNode extends IBaseTrain {
    readonly end: false;
    prev(): IBaseTrain;
    next(): IBaseTrain;
}