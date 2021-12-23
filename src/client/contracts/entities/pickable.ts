/*
PickableEntity

Type of PhysicalEntity

Can be picked
*/

import { IPickableEntity } from "../../../contracts/entities/pickable";
import { IClientPhysicalEntity } from "./base/physical";


export interface IClientPickableEntity extends IClientPhysicalEntity, IPickableEntity {};