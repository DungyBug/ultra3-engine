import { Side } from "../../constants/side";
import { IMapEvent } from "../map-event";

/*
CollisionStart
Emits when player starts collision with object
*/
export interface ICollisionStartMapEvent extends IMapEvent {
    name: "collisionstart",
    side: Side;
}