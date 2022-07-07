import { Entity } from "../entity";
import { MapObject } from "../map-object";

type WorldEvents = {
    framestart: [];
    frameend: [];
    newEntity: [Entity];
    entityDelete: [Entity];
    newObject: [MapObject];
}

export default WorldEvents