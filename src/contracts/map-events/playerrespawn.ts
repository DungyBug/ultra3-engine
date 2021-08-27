import { Player } from "../../entities/player";
import { IMapEvent } from "../map-event";

/*
PlayerSpawnEvent
Emits when player respawns ( starts playing ) in object.
Don't emit when player teleports to destination somewhere in object.
Don't emit when PlayerSpawn emits
*/
export interface IPlayerRespawnEvent extends IMapEvent {
    name: "playerrespawn",
    player: Array<Player>
}