import { Player } from "../../entities/player";
import { IDifficulty } from "../difficulty";
import { IMapObject, IMapObjectProps, IMapObjectState } from "../map-object";
import { PreparedNetData } from "../prepared-net-data";

export interface IPlayerSpawnProps extends IMapObjectProps {
    difficulty: IDifficulty;
}

export interface IPlayerSpawn extends IMapObject {
    // difficulty: IDifficulty;

    get difficulty(): IDifficulty;
    spawnPlayer(): Player;
}

export interface IPlayerSpawnState extends IMapObjectState {
    props: PreparedNetData<IPlayerSpawnProps>;
}
