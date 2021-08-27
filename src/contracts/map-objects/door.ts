import { IVector } from "../base/vector";
import { IEntity } from "../entity";
import { IMapObject, IMapObjectProps } from "../map-object";

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
};