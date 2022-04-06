import { IEntity } from "./entity";
import { IMapObject } from "./map-object";

/**
 * Generates a new type for variable prepared for transfering thorugh net.
 * Every entity and mapobject type converts to number type ( its id )
 */
export type PreparedNetData<T extends Record<string | number, any>> = {
    [K in keyof T]: T[K] extends Record<string | number, unknown>
        ? PreparedNetData<T[K]>
        : T[K] extends IEntity | IMapObject
        ? number
        : T[K] extends Array<IEntity | IMapObject>
        ? Array<number>
        : T[K];
};
