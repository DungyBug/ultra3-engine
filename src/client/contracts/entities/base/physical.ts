/*
PhysicalEntity

Type of Viewable entity

Entity also can responce to physics.
Now entity can fall down
*/

import { IPhysicalEntityParams, IPhysicalEntity, IPhysicalEntityState } from "../../../../core/contracts/entities/base/physical";
import { IViewableEntity, IViewableEntityParams } from "./viewable";


export interface IClientPhysicalEntityParams extends IPhysicalEntityParams, IViewableEntityParams {};

export interface IClientPhysicalEntity extends IPhysicalEntity, IViewableEntity {
    getEntityState(): IPhysicalEntityState;
    setEntityState(state: IPhysicalEntityState): void;
};