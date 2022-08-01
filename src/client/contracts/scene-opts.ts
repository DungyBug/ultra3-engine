import { Entity } from "../../core/entity";
import { MapObject } from "../../core/map-object";
import ClientMapObject from "../map/client-object";

export default interface ISceneOpts<T extends Entity = Entity, U extends MapObject = MapObject> {
    entities?: Array<T>;
    mapobjects?: Array<ClientMapObject<U>>;
}