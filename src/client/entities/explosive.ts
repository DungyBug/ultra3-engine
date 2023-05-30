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
    model: IMesh | null;

    constructor(params: IClientExplosiveEntityParams, world: ClientWorld) {
        super(params, world);
        this.model = params.model;
    }
}

export default ClientExplosiveEntity;
