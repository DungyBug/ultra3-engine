/*
WeaponEntity

Type of PickableEntity

Entity, that can shoot
*/

import { ClassPattern } from "../ent_types";
import { IPhysicalEntityParams } from "./base/physical";
import { IPickableEntity } from "./pickable";

export interface IWeaponParams extends IPhysicalEntityParams {
    classname: ClassPattern<"wp">;
    damage: number;
}

export interface IWeapon extends IPickableEntity {
    shoot(): void;
}