import { Player } from "../../core/entities/player";
import ClientWorld from "../client-world";
import IClientPlayer, {
    IClientPlayerParams,
} from "../contracts/entities/player";
import IMesh from "../contracts/mesh";

class ClientPlayer extends Player implements IClientPlayer {
    model: IMesh;

    constructor(params: IClientPlayerParams, world: ClientWorld) {
        super(params, world);

        this.model = params.model;

        world.pushEntityToRenderQueue(this);
    }
}

export default ClientPlayer;
