import { IBaseTrain } from "./train";

export interface ITrainStart extends IBaseTrain {
    next(): IBaseTrain;
    getNodesList(): Array<IBaseTrain>;
}