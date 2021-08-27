/*
MovableEntity

type of PhysicalEntity

Entity that can move itself
*/

import { IForce } from "../../physics/force";
import { IPhysicalEntity } from "./physical";

export interface IMovableEntity extends IPhysicalEntity {
    forces: Array<IForce>;

    addForce(force: IForce): void;
    deleteForce(force: IForce): void;
    deleteAllForces(): void;
};