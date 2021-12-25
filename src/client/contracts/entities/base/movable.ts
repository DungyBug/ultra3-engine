/*
MovableEntity

type of PhysicalEntity

Entity that can move itself
*/

import { IMovableEntity, IMovableEntityState } from "../../../../core/contracts/entities/base/movable";
import { IClientPhysicalEntity } from "./physical";


export interface IClientMovableEntity extends IClientPhysicalEntity, IMovableEntity {
    getEntityState(): IMovableEntityState;
    setEntityState(state: IMovableEntityState): void;
};