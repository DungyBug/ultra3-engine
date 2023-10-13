import { IExplosiveEntityState } from "../../core/contracts/entities/explosive";
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

    static fromState(state: IExplosiveEntityState, world: ClientWorld): ClientExplosiveEntity {
        const entity = new ClientExplosiveEntity({...state, model: null}, world);

        entity.setEntityState(state);

        return entity;
    }
}

export default ClientExplosiveEntity;
