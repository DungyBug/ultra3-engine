import { Player } from "../../entities/player";
import { IDifficulty } from "../difficulty";
import { IMapObject } from "../map-object";

export interface IPlayerSpawn extends IMapObject {
    // difficulty: IDifficulty;

    spawnPlayer(difficulty: IDifficulty): Player;
}