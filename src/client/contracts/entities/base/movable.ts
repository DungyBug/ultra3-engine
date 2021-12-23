/*
MovableEntity

type of PhysicalEntity

Entity that can move itself
*/

import { IMovableEntity } from "../../../../contracts/entities/base/movable";
import { IClientPhysicalEntity } from "./physical";


export interface IClientMovableEntity extends IClientPhysicalEntity, IMovableEntity {};