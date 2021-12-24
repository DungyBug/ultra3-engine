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

        for(let i = 0; i < this.forces.length; i++) {
            forces.push({
                force: this.forces[i].force,
                direction: {
                    x: this.forces[i].direction.x,
                    y: this.forces[i].direction.y,
                    z: this.forces[i].direction.z
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
        for(let i = 0; i < state.forces.length; i++) {
            this.forces.push({
                force: state.forces[i].force,
                direction: {
                    x: state.forces[i].direction.x,
                    y: state.forces[i].direction.y,
                    z: state.forces[i].direction.z
                }
            });
        }
    }
}