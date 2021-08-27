import { PickableEntity } from "./pickable";
import { IWeapon, IWeaponParams } from "../contracts/entities/weapon";
import { ClassPattern } from "../contracts/ent_types";
import { World } from "../world";

export class Weapon extends PickableEntity implements IWeapon {
    readonly classname: ClassPattern<"wp">; // All weapons have prefix "wp_"
    protected damage: number;
    protected lastShoot: number; // Time

    constructor(params: IWeaponParams, world: World) {
        super(params, world);
        this.damage = params.damage;
        this.lastShoot = 0;
    }

    shoot() {
        
    }
}