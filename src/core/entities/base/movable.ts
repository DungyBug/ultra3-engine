import { World } from "../../world";
import { IMovableEntity, IMovableEntityState } from "../../contracts/entities/base/movable";
import { IPhysicalEntityParams } from "../../contracts/entities/base/physical";
import { IForce } from "../../contracts/physics/force";
import { PhysicalEntity } from "./physical";

export class MovableEntity extends PhysicalEntity implements IMovableEntity {
    forces: Array<IForce>;

    constructor(params: IPhysicalEntityParams, world: World) {
        super(params, world);
        this.forces = [];
    }

    addForce(force: IForce) {
        this.forces.push(force);
    }

    deleteForce(force: IForce) {
        let index = this.forces.indexOf(force);

        if(index !== -1) {
            this.forces.splice(index, 1);
        }
    }

    deleteAllForces() {
        this.forces = [];
    }

    getEntityState(): IMovableEntityState {
        let parentState = super.getEntityState();

        let forces: Array<IForce> = [];

        for(const force of this.forces) {
            forces.push({
                force: force.force,
                direction: {
                    x: force.direction.x,
                    y: force.direction.y,
                    z: force.direction.z
                }
            });
        }

        return {
            ...parentState,
            forces
        };
    }

    setEntityState(state: IMovableEntityState): void {
        super.setEntityState(state);

        this.forces = [];

        // To prevent variable linking
        for(const force of this.forces) {
            this.forces.push({
                force: force.force,
                direction: {
                    x: force.direction.x,
                    y: force.direction.y,
                    z: force.direction.z
                }
            });
        }
    }
}