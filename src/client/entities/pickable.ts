import { PickableEntity } from "../../entities/pickable";
import { World } from "../../world";
import { IClientPhysicalEntityParams } from "../contracts/entities/base/physical";
import { IClientPickableEntity } from "../contracts/entities/pickable";
import IMesh from "../contracts/mesh";

class ClientPickableEntity extends PickableEntity implements IClientPickableEntity {
    model: IMesh;

    constructor(params: IClientPhysicalEntityParams, world: World) {
        super(params, world);

        this.model = params.model;
    }
}

export default ClientPickableEntity;