/*
ExplosiveEntity

Type of PhysicalEntity

Entity that can be exploded
*/

import { IExplosiveEntity, IExplosiveEntityParams } from "../../../contracts/entities/explosive";
import { IClientPhysicalEntity, IClientPhysicalEntityParams } from "./base/physical";

export interface IClientExplosiveEntityParams extends IExplosiveEntityParams, IClientPhysicalEntityParams {};

export interface IClientExplosiveEntity extends IClientPhysicalEntity, IExplosiveEntity {};