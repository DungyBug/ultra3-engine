import { World } from "../world";
import { IPhysicalEntityParams } from "../contracts/entities/base/physical";
import { IPickableEntity, IPickableEntityState } from "../contracts/entities/pickable";
import { PhysicalEntity } from "./base/physical";
import { IEntity } from "../contracts/entity";

export class PickableEntity extends PhysicalEntity implements IPickableEntity {
    protected owner: IEntity | null;
    protected picked: boolean;

    constructor(params: IPhysicalEntityParams, world: World) {
        super(params, world);
        this.owner = null;
        this.picked = false;
    }

    pick(by: IEntity) {
        if(this === by) {
            throw new Error("PickableEntity: Cannot pick self.");
        }

        this.owner = by;
        this.picked = true;
    }

    unpick() {
        this.owner = null;
        this.picked = false;
    }

    
    getEntityState(): IPickableEntityState {
        let parentState = super.getEntityState();

        return {
            ...parentState,
            owner: this.owner?.id ?? -1,
            picked: this.picked
        }
    }

    setEntityState(state: IPickableEntityState): void {
        super.setEntityState(state);

        this.picked = state.picked;

        if(this.picked) {
            this.owner = this.world.getEntity(state.owner);
        } else {
            this.owner = null;
        }
    }
}