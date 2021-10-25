import { Player } from "../../entities/player";
import { IMapEvent } from "../map-event";

/*
PlayerSpawnEvent
Emits when player spawns ( starts playing ) in object.
Don't emit when player teleports to destination somewhere in object.
Don't emit when player respawns somewhere in object.
*/
export interface IPlayerSpawnEvent extends IMapEvent {
    type: "playerspawn",
    player: Array<Player>
}