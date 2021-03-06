import { PickableEntity } from "./pickable";
import { IWeapon, IWeaponParams, IWeaponState } from "../contracts/entities/weapon";
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

    getEntityState(): IWeaponState {
        let parentState = super.getEntityState();

        return {
            ...parentState,
            damage: this.damage,
            lastShoot: this.lastShoot
        }
    }

    setEntityState(state: IWeaponState): void {
        super.setEntityState(state);

        this.damage = state.damage;
        this.lastShoot = state.lastShoot;
    }
}