import { Side } from "../../constants/side";
import { IMapEvent } from "../map-event";

/*
CollisionStop
Emits when player stops collision with object ( f.e. goes away )
*/
export interface ICollisionStopMapEvent extends IMapEvent {
    type: "collisionstop",
    side: Side;
}