import { IPhysicalEntityState } from "../../../core/contracts/entities/base/physical";
import { PhysicalEntity } from "../../../core/entities/base/physical";
import { World } from "../../../core/world";
import { IClientPhysicalEntity, IClientPhysicalEntityParams } from "../../contracts/entities/base/physical";
import IMesh from "../../contracts/mesh";

class ClientPhysicalEntity extends PhysicalEntity implements IClientPhysicalEntity {
    model: IMesh | null;
    
    constructor(params: IClientPhysicalEntityParams, world: World) {
        super(params, world);

        this.model = params.model;
    }

    static fromState(state: IPhysicalEntityState, world: World): ClientPhysicalEntity {
        const entity = new ClientPhysicalEntity({...state, model: null}, world);

        entity.setEntityState(state);

        return entity;
    }
};

export default ClientPhysicalEntity;