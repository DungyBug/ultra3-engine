import { TeleportType } from "../../constants/teleport-type";
import { Player } from "../../entities/player";
import { IMapEvent } from "../map-event";

/*
PlayerSpawnEvent
Emits when player teleports to someplace in object or teleports from someplace in object.
Don't emit when PlayerSpawn emits
Don't emit when PlayerRespawn emits
*/
export interface IPlayerTeleportEvent extends IMapEvent {
    type: "playerteleport",
    player: Array<Player>,
    teleportType: TeleportType
}