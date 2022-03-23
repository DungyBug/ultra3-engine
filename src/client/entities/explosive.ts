import { ExplosiveEntity } from "../../core/entities/explosive";
import ClientWorld from "../client-world";
import {
    IClientExplosiveEntity,
    IClientExplosiveEntityParams,
} from "../contracts/entities/explosive";
import IMesh from "../contracts/mesh";

class ClientExplosiveEntity
    extends ExplosiveEntity
    implements IClientExplosiveEntity
{
    model: IMesh;

    constructor(params: IClientExplosiveEntityParams, world: ClientWorld) {
        super(params, world);

        this.model = params.model;

        world.pushEntityToRenderQueue(this);
    }
}

export default ClientExplosiveEntity;
