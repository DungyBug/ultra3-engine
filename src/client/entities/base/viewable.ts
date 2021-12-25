import { Entity } from "../../../core/entity";
import { World } from "../../../core/world";
import { IViewableEntity, IViewableEntityParams } from "../../contracts/entities/base/viewable";
import IMesh from "../../contracts/mesh";

class ViewableEntity extends Entity implements IViewableEntity {
    model: IMesh;

    constructor(params: IViewableEntityParams, world: World) {
        super(params, world);
        this.model = params.model;
    }
}

export default ViewableEntity;