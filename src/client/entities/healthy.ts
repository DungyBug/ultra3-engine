import { IHealthyEntityState } from "../../core/contracts/entities/healthy";
import { HealthyEntity } from "../../core/entities/healthy";
import ClientWorld from "../client-world";
import IClientHealthyEntity, {
    IClientHealthyEntityParams,
} from "../contracts/entities/healthy";
import IMesh from "../contracts/mesh";

class ClientHealthyEntity
    extends HealthyEntity
    implements IClientHealthyEntity
{
    model: IMesh | null;

    constructor(params: IClientHealthyEntityParams, world: ClientWorld) {
        super(params, world);
        this.model = params.model;
    }

    static fromState(state: IHealthyEntityState, world: ClientWorld): ClientHealthyEntity {
        const entity = new ClientHealthyEntity({...state, model: null}, world);

        entity.setEntityState(state);

        return entity;
    }
}

export default ClientHealthyEntity;
