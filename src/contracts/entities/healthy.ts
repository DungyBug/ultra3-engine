/*
HealthyEntity

Type of Entity

Entity, that has health
*/

import { IEntity, IEntityParams } from "../entity";

export interface IHealthyEntityParams extends IEntityParams {
    health?: number; // 100 by default
}

export interface IHealthyEntity extends IEntity {
    health: number;
    dead: boolean;

    damage(damage: number, attacker: IEntity): void;
}