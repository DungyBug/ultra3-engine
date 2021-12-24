import { Side } from "../../constants/side";
import { IMapEvent } from "../map-event";

/*
CollisionStart
Emits when player starts collision with object
*/
export interface ICollisionStartMapEvent extends IMapEvent {
    type: "collisionstart",
    side: Side;
}