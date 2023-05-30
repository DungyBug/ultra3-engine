import { IMapObjectState } from "../map-object";
import { IBaseTrain } from "./train";

export interface ITrainEnd extends IBaseTrain {
    readonly end: true;
    prev(): IBaseTrain | null;
    getNodesList(): Array<IBaseTrain>;
}

export interface ITrainEndState extends IMapObjectState {
    prev: number;
}
