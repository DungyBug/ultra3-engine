import { IPickableEntityState } from "../../core/contracts/entities/pickable";
import { PickableEntity } from "../../core/entities/pickable";
import ClientWorld from "../client-world";
import { IClientPhysicalEntityParams } from "../contracts/entities/base/physical";
import { IClientPickableEntity } from "../contracts/entities/pickable";
import IMesh from "../contracts/mesh";

class ClientPickableEntity
    extends PickableEntity
    implements IClientPickableEntity
{
    model: IMesh | null;

    constructor(params: IClientPhysicalEntityParams, world: ClientWorld) {
        super(params, world);
        this.model = params.model;
    }

    static fromState(state: IPickableEntityState, world: ClientWorld): ClientPickableEntity {
        const entity = new ClientPickableEntity({...state, model: null}, world);

        entity.setEntityState(state);

        return entity;
    }
}

export default ClientPickableEntity;
