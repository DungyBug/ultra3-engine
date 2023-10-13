import { IEntityState } from "../../../core/contracts/entity";
import { Entity } from "../../../core/entity";
import ClientWorld from "../../client-world";
import {
    IViewableEntity,
    IViewableEntityParams,
} from "../../contracts/entities/base/viewable";
import IMesh from "../../contracts/mesh";

class ViewableEntity extends Entity implements IViewableEntity {
    model: IMesh | null;

    constructor(params: IViewableEntityParams, world: ClientWorld) {
        super(params, world);
        this.model = params.model;
    }

    setEntityState(state: IEntityState): void {
        super.setEntityState(state);

        if(this.model !== null) {
            this.model.pos = state.pos;
        }
    }

    static fromState(state: IEntityState, world: ClientWorld): ViewableEntity {
        const entity = new ViewableEntity({...state, model: null}, world);

        entity.setEntityState(state);

        return entity;
    }
}

export default ViewableEntity;
