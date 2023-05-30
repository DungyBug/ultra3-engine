import { IMapObjectState } from "../map-object";
import { IBaseTrain } from "./train";

export interface ITrainNode extends IBaseTrain {
    readonly end: false;
    prev(): IBaseTrain | null;
    next(): IBaseTrain | null;
}

export interface ITrainNodeState extends IMapObjectState {
    prev: number;
    next: number;
}
