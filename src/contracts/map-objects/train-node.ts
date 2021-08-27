import { IBaseTrain } from "./train";

export interface ITrainNode extends IBaseTrain {
    prev(): IBaseTrain;
    next(): IBaseTrain;
}