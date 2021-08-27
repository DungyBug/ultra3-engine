import { Side } from "../../constants/side";
import { IMapEvent } from "../map-event";

/*
ShootEvent
Emits when player shoots to object
If you return true in callback, bullet or projectile will disappear.
*/
export interface IShootEvent extends IMapEvent {
    name: "shoot",
    side: Side;
    damage: number;
}