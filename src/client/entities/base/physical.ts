import { PhysicalEntity } from "../../../entities/base/physical";
import { World } from "../../../world";
import { IClientPhysicalEntity, IClientPhysicalEntityParams } from "../../contracts/entities/base/physical";
import IMesh from "../../contracts/mesh";

class ClientPhysicalEntity extends PhysicalEntity implements IClientPhysicalEntity {
    model: IMesh;
    
    constructor(params: IClientPhysicalEntityParams, world: World) {
        super(params, world);

        this.model = params.model;
    }
};

export default ClientPhysicalEntity;