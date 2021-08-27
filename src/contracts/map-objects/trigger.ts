import { IMapObject } from "../map-object";

export interface ITrigger extends IMapObject {
    trigger(): void;
};