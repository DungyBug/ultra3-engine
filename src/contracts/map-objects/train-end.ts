import { IBaseTrain } from "./train";

export interface ITrainEnd extends IBaseTrain {
    prev(): IBaseTrain;
    getNodesList(): Array<IBaseTrain>;
}