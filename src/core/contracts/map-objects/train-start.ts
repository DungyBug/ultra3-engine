import { IMapObjectState } from "../map-object";
import { IBaseTrain } from "./train";

export interface ITrainStart extends IBaseTrain {
    readonly end: true;
    next(): IBaseTrain | null;
    getNodesList(): Array<IBaseTrain>;
}

export interface ITrainStartState extends IMapObjectState {
    next: number;
}
