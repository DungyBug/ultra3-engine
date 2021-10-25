import { IEntity } from "../entity";
import { IMapObject } from "../map-object";

export interface ITrigger extends IMapObject {
    trigger(by: IEntity): void;
};