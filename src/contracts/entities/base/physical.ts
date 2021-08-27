/*
PhysicalEntity

Type of Viewable entity

Entity also can responce to physics.
Now entity can fall down
*/

import { PhysicalActivity } from "../../../constants/physical-activity";
import { IViewableEntity, IViewableEntityParams } from "./Viewable";

export interface IPhysicalEntityParams extends IViewableEntityParams {
    // 3d model with which calculate physics
    physicalModel: string;
    // would it fall?
    activity?: PhysicalActivity; // Active by default
    // weight of the entity
    weight?: number; // 1 by default
}

export interface IPhysicalEntity extends IViewableEntity {
    physicalModel: string; // Path
    activity: PhysicalActivity;
    weight: number;
}