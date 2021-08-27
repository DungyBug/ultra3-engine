/*
ExplosiveEntity

Type of PhysicalEntity

Entity that can be exploded
*/

import { IPhysicalEntity, IPhysicalEntityParams } from "./base/physical";

export interface IExplosiveEntityParams extends IPhysicalEntityParams {
    explodeRadius?: number; // 2.5 by default
    explodeDamage?: number; // 100 by default
}

export interface IExplosiveEntity extends IPhysicalEntity {
    explodeRadius: number;
    explodeDamage: number;

    explode(): void;
};