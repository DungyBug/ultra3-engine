/*
HealthyEntity

Type of Entity

Entity, that has health
*/

import { IEntity, IEntityParams, IEntityState } from "../entity";

export interface IHealthyEntityParams extends IEntityParams {
    health?: number; // 100 by default
}

export interface IHealthyEntityState extends IEntityState {
    health: number;
}

export interface IHealthyEntity extends IEntity {
    health: number;
    dead: boolean;

    damage(damage: number, attacker: IEntity | null): void;

    getEntityState(): IHealthyEntityState;
    setEntityState(state: IHealthyEntityState): void;
}