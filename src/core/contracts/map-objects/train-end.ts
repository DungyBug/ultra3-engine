import { IBaseTrain } from "./train";

export interface ITrainEnd extends IBaseTrain {
    readonly end: true;
    prev(): IBaseTrain;
    getNodesList(): Array<IBaseTrain>;
}