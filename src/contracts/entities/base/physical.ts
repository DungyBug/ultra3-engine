/*
PhysicalEntity

Type of Viewable entity

Entity also can responce to physics.
Now entity can fall down
*/

import { PhysicalActivity } from "../../../constants/physical-activity";
import IBasePhysicalModel from "../../base-physical-model";
import { IEntity, IEntityParams } from "../../entity";

export interface IPhysicalEntityParams extends IEntityParams {
    // 3d model with which calculate physics
    physicalModel: IBasePhysicalModel;
    // would it fall?
    activity?: PhysicalActivity; // Active by default
    // weight of the entity
    weight?: number; // 0 by default
}

export interface IPhysicalEntity extends IEntity {
    physicalModel: IBasePhysicalModel;
    activity: PhysicalActivity;
    weight: number;
}