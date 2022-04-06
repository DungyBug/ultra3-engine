import { DoorState } from "../../constants/door-state/door-state";
import { IVector } from "../base/vector";
import { IEntity } from "../entity";
import { IMapObject, IMapObjectProps, IMapObjectState } from "../map-object";

export interface IDoorProps extends IMapObjectProps {
    delay?: number; // 30s by default ( 30000 )
    speed: number;
    distance: number;
    direction: IVector;
    openOn?: Array<string>; // Names of events
    closeOn?: Array<string>; // Names of events
}

export interface IDoor extends IMapObject {
    open(by: IEntity): void;
    close(by: IEntity): void;
}

export interface IDoorState extends IMapObjectState {
    props: IDoorProps;
    nextthink: number;
    prevthink: number;
    state: DoorState;
    origin: IVector;
}
