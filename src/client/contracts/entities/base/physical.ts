/*
PhysicalEntity

Type of Viewable entity

Entity also can responce to physics.
Now entity can fall down
*/

import { IPhysicalEntity, IPhysicalEntityParams } from "../../../../contracts/entities/base/physical";
import { IViewableEntity, IViewableEntityParams } from "./viewable";


export interface IClientPhysicalEntityParams extends IPhysicalEntityParams, IViewableEntityParams {};

export interface IClientPhysicalEntity extends IPhysicalEntity, IViewableEntity {};