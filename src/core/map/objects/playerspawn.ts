import { IDifficulty } from "../../contracts/difficulty";
import {
    IPlayerSpawn,
    IPlayerSpawnProps,
    IPlayerSpawnState,
} from "../../contracts/map-objects/playerspawn";
import { Player } from "../../entities/player";
import { MapObject } from "../../map-object";
import { World } from "../../world";

export class PlayerSpawn extends MapObject implements IPlayerSpawn {
    protected _difficulty: IDifficulty;

    constructor(props: IPlayerSpawnProps, world: World) {
        super("", props, world);
        this._difficulty = props.difficulty;
    }

    get difficulty() {
        return this._difficulty;
    }

    spawnPlayer() {
        let player = new Player(
            {
                classname: "player_player",
                pos: this.props.pos,
            },
            this.world
        );

        return player;
    }

    getMapObjectState(): IPlayerSpawnState {
        const parentState = super.getMapObjectState();

        return {
            ...parentState,
            props: {
                ...parentState.props,
                difficulty: this._difficulty,
            },
        };
    }

    setMapObjectState(state: IPlayerSpawnState): void {
        super.setMapObjectState(state);

        this._difficulty = state.props.difficulty;
    }
}
