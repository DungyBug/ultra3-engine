/*
ExplosiveEntity

Type of PhysicalEntity

Entity that can be exploded
*/

import { IExplosiveEntity, IExplosiveEntityParams, IExplosiveEntityState } from "../../../core/contracts/entities/explosive";
import { IClientPhysicalEntity, IClientPhysicalEntityParams } from "./base/physical";

export interface IClientExplosiveEntityParams extends IExplosiveEntityParams, IClientPhysicalEntityParams {};

export interface IClientExplosiveEntity extends IClientPhysicalEntity, IExplosiveEntity {
    getEntityState(): IExplosiveEntityState;
    setEntityState(state: IExplosiveEntityState): void;
};