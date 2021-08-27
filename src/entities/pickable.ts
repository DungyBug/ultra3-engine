import { World } from "../world";
import { IPhysicalEntityParams } from "../contracts/entities/base/physical";
import { IPickableEntity } from "../contracts/entities/pickable";
import { Entity } from "../entity";
import { PhysicalEntity } from "./base/physical";

export class PickableEntity extends PhysicalEntity implements IPickableEntity {
    protected owner: Entity;
    protected picked: boolean;

    constructor(params: IPhysicalEntityParams, world: World) {
        super(params, world);
        this.owner = null;
        this.picked = false;
    }

    pick(by: Entity) {
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
}