/*
MovableEntity

type of PhysicalEntity

Entity that can move itself
*/

import { IForce } from "../../physics/force";
import { IPhysicalEntity, IPhysicalEntityState } from "./physical";

export interface IMovableEntityState extends IPhysicalEntityState {
    forces: Array<IForce>;
};

export interface IMovableEntity extends IPhysicalEntity {
    forces: Array<IForce>;

    addForce(force: IForce): void;
    deleteForce(force: IForce): void;
    deleteAllForces(): void;

    getEntityState(): IMovableEntityState;
    setEntityState(state: IMovableEntityState): void;
};