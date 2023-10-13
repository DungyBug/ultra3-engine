import { IPlayerState } from "../../core/contracts/entities/player";
import { Player } from "../../core/entities/player";
import ClientWorld from "../client-world";
import IClientPlayer, {
    IClientPlayerParams,
} from "../contracts/entities/player";
import IMesh from "../contracts/mesh";

class ClientPlayer extends Player implements IClientPlayer {
    model: IMesh | null;

    constructor(params: IClientPlayerParams, world: ClientWorld) {
        super(params, world);
        this.model = params.model;
    }

    static fromState(state: IPlayerState, world: ClientWorld): ClientPlayer {
        const entity = new ClientPlayer({...state, model: null}, world);

        entity.setEntityState(state);

        return entity;
    }
}

export default ClientPlayer;
