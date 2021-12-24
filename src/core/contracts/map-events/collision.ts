import { Side } from "../../constants/side";
import { IMapEvent } from "../map-event";

/*
CollisionMapEvent
Emits when player collides with object
*/
export interface ICollisionMapEvent extends IMapEvent {
    type: "collision",
    side: Side;
}