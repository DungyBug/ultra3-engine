import { IGunEntity, IGunEntityParams } from "../contracts/entities/gun";
import { World } from "../world";
import { Weapon } from "./weapon";

export class GunEntity extends Weapon implements IGunEntity {
    protected readonly reloadTime: number;
    protected readonly magazineReloadTime: number;
    protected readonly hasMagazine: boolean; // false by default
    protected readonly maxAmmo: number; // 120 by default
    protected ammo: number; // 0 by default
    protected ammoInMagazine: number; // 0 by default
    protected readonly magazineAmmoCount: number; // 0 if hasn't magazine and 30 if has

    constructor(params: IGunEntityParams, world: World) {
        super(params, world);
        this.hasMagazine = params.hasMagazine || false;
        this.reloadTime = params.reloadTime;
        this.magazineAmmoCount = params.magazineAmmoCount || (this.hasMagazine ? 30 : 0);
        this.magazineReloadTime = params.magazineReloadTime || (this.hasMagazine ? 10000 : 0);
        this.ammo = params.startAmmo || 0;
        this.maxAmmo = params.maxAmmo || 120;
        this.ammoInMagazine = this.magazineAmmoCount;
    }

    addAmmo(ammo: number) {
        this.ammo += ammo;

        // Check for ammo bounding
        this.ammo = Math.min(this.ammo, this.maxAmmo);
    }

    reloadMagazine() {
        // TODO: Add state changing ( to prevent shooting while reloading magazine )

        let ammoToAdd = this.magazineAmmoCount - this.ammoInMagazine;

        ammoToAdd = Math.min(this.ammo, ammoToAdd); // We can't fill empty magazine by 30 bullets if we have only 14, so check for ammo left
        this.ammo -= this.magazineAmmoCount - this.ammoInMagazine;
        this.ammoInMagazine = this.magazineAmmoCount;
    }
}