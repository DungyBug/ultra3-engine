import { Side } from "../../constants/side";
import { IMapEvent } from "../map-event";

/*
DamageEvent
Emits when something damages object
Very simillar to ShootEvent, but in ShootEvent bullet should collide object. In this case, even explode somewhere near can trigger DamageEvent
*/
export interface IDamageEvent extends IMapEvent {
    type: "damage",
    side: Side;
    damage: number;
}