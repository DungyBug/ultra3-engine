import { ExplosiveEntity } from "../../entities/explosive";
import { World } from "../../world";
import { IClientExplosiveEntity, IClientExplosiveEntityParams } from "../contracts/entities/explosive";
import IMesh from "../contracts/mesh";

class ClientExplosiveEntity extends ExplosiveEntity implements IClientExplosiveEntity {
    model: IMesh;

    constructor(params: IClientExplosiveEntityParams, world: World) {
        super(params, world);

        this.model = params.model;
    }
}

export default ClientExplosiveEntity;