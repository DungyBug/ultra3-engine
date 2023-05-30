import { MovableEntity } from "../../../core/entities/base/movable";
import { World } from "../../../core/world";
import { IClientMovableEntity } from "../../contracts/entities/base/movable";
import { IClientPhysicalEntityParams } from "../../contracts/entities/base/physical";
import IMesh from "../../contracts/mesh";


class ClientMovableEntity extends MovableEntity implements IClientMovableEntity {
    model: IMesh | null;

    constructor(params: IClientPhysicalEntityParams, world: World) {
        super(params, world);
        
        this.model = params.model;
    }
}

export default ClientMovableEntity;