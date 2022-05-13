import { IWeapon, IWeaponParams, IWeaponState } from './weapon';

export interface IMagazineGunEntityParams extends IWeaponParams {
    maxAmmo?: number; // 120 by default
    startAmmo?: number; // 0 by default
    hasMagazine: true;
    magazineAmmoCount: number;
    reloadTime: number; // Reload time between patrons
    magazineReloadTime: number; // 10 seconds by default
}

export interface ISingleShotGunEntityParams extends IWeaponParams {
    maxAmmo?: number; // 120 by default
    startAmmo?: number; // 0 by default
    hasMagazine: false;
    reloadTime: number;
}

export type IGunEntityParams = IMagazineGunEntityParams | ISingleShotGunEntityParams;

interface IBaseGunEntityState extends IWeaponState {
    hasMagazine: boolean;
    maxAmmo: number;
    reloadTime: number;
    ammo: number;
}

interface IMagazineGunEntityState extends IBaseGunEntityState {
    magazineReloadTime: number;
    hasMagazine: true;
    ammoInMagazine: number;
    magazineAmmoCount: number;
}

interface ISingleShotGunEntityState extends IBaseGunEntityState {
    hasMagazine: false;
}

export type GunEntityState = IMagazineGunEntityState | ISingleShotGunEntityState;

export interface IGunEntity extends IWeapon {
    addAmmo(ammo: number): void;
    reloadMagazine(): void;

    getEntityState(): GunEntityState;
    setEntityState(state: GunEntityState): void;
};