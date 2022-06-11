import { IEntityState } from "../../../core/contracts/entity";
import { Entity } from "../../../core/entity";
import ClientWorld from "../../client-world";
import {
    IViewableEntity,
    IViewableEntityParams,
} from "../../contracts/entities/base/viewable";
import IMesh from "../../contracts/mesh";

class ViewableEntity extends Entity implements IViewableEntity {
    model: IMesh;

    constructor(params: IViewableEntityParams, world: ClientWorld) {
        super(params, world);
        this.model = params.model;
    }

    setEntityState(state: IEntityState): void {
        super.setEntityState(state);
        this.model.pos = state.pos;
    }
}

export default ViewableEntity;
