import { IVector } from "../base/vector";
import { IMapObject } from "../map-object";

export interface IBaseTrain extends IMapObject {
    getPos(): IVector;
};