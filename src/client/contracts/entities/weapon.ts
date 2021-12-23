/*
WeaponEntity

Type of PickableEntity

Entity, that can shoot
*/

import { IWeapon, IWeaponParams } from "../../../contracts/entities/weapon";
import { IClientPhysicalEntityParams } from "./base/physical";
import { IClientPickableEntity } from "./pickable";

export interface IClientWeaponParams extends IWeaponParams, IClientPhysicalEntityParams {
    classname: IWeaponParams["classname"];
};

export interface IClientWeapon extends IClientPickableEntity, IWeapon {}