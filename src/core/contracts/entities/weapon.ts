/*
WeaponEntity

Type of PickableEntity

Entity, that can shoot
*/

import { ClassPattern } from "../ent_types";
import { IPhysicalEntityParams } from "./base/physical";
import { IPickableEntity, IPickableEntityState } from "./pickable";

export interface IWeaponParams extends IPhysicalEntityParams {
    damage: number;
}

export interface IWeaponState extends IPickableEntityState {
    damage: number;
    lastShoot: number;
}

export interface IWeapon extends IPickableEntity {
    shoot(): void;

    getEntityState(): IWeaponState;
    setEntityState(state: IWeaponState): void;
}