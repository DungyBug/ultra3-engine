import { Player } from "../../entities/player";
import { IDifficulty } from "../difficulty";
import { IMapObject, IMapObjectProps } from "../map-object";

export interface IPlayerSpawnProps extends IMapObjectProps {
    difficulty: IDifficulty;
}

export interface IPlayerSpawn extends IMapObject {
    // difficulty: IDifficulty;

    get difficulty(): IDifficulty;
    spawnPlayer(): Player;
}