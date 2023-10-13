import { GunEntityState, IGunEntity, IGunEntityParams, IMagazineGunEntityParams } from "../contracts/entities/gun";
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
    protected magazineReloadEnd: number;

    constructor(params: IGunEntityParams, world: World) {
        super(params, world);
        this.hasMagazine = params.hasMagazine || false;
        this.reloadTime = params.reloadTime;
        this.magazineAmmoCount = (this.hasMagazine ? (params as IMagazineGunEntityParams).magazineAmmoCount : 0);
        this.magazineReloadTime = (this.hasMagazine ? (params as IMagazineGunEntityParams).magazineReloadTime : 0);
        this.ammo = params.startAmmo || 0;
        this.maxAmmo = params.maxAmmo || 120;
        this.magazineReloadEnd = 0;
        this.ammoInMagazine = 0;
    }

    addAmmo(ammo: number) {
        this.ammo += ammo;

        // Check for ammo bounding
        this.ammo = Math.min(this.ammo, this.maxAmmo);
    }

    reloadMagazine() {
        if(this.currentState !== 1 && this.ammoInMagazine < this.magazineAmmoCount) {
            let ammoToAdd = this.magazineAmmoCount - this.ammoInMagazine; // Get amount of ammo we need to add to magazine to make it full ( we need add 5 bullets to 45 to make magazine full )

            ammoToAdd = Math.min(this.ammo, ammoToAdd); // We can't fill empty magazine by 30 bullets if we have only 14, so check for ammo left

            this.ammo -= ammoToAdd;
            this.ammoInMagazine += ammoToAdd;

            this.requestingState = 1;
            this.magazineReloadEnd = this.world.getTime() + this.magazineReloadTime;
        }
    }

    think() {
        super.think();

        if(this.currentState === 1) {
            if(this.world.getTime() >= this.magazineReloadEnd) {
                this.requestingState = 0;
            }
        }

        this.currentState = this.requestingState;
    }
    
    getEntityState(): GunEntityState {
        let parentState = super.getEntityState();

        if(this.hasMagazine) {
            return {
                ...parentState,
                hasMagazine: true,
                magazineReloadTime: this.magazineReloadTime,
                ammoInMagazine: this.ammoInMagazine,
                maxAmmo: this.maxAmmo,
                reloadTime: this.reloadTime,
                ammo: this.ammo,
                magazineAmmoCount: this.magazineAmmoCount
            }
        } else {
            return {
                ...parentState,
                hasMagazine: false,
                maxAmmo: this.maxAmmo,
                reloadTime: this.reloadTime,
                ammo: this.ammo
            }
        }
    }
    
    setEntityState(state: GunEntityState): void {
        super.setEntityState(state);

        this.ammo = state.ammo;
        
        if(state.hasMagazine) {
            this.ammoInMagazine = state.ammoInMagazine;
        }
    }

    static fromState(state: GunEntityState, world: World): GunEntity {
        const entity = new GunEntity(state, world);

        entity.setEntityState(state);

        return entity;
    }
}