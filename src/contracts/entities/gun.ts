import { IWeapon, IWeaponParams } from './weapon';

export interface IGunEntityParams extends IWeaponParams {
    maxAmmo?: number; // 120 by default
    startAmmo?: number; // 0 by default
    hasMagazine?: boolean; // false by default
    magazineAmmoCount?: number; // 0 if hasn't magazine and 30 if has
    reloadTime: number;
    magazineReloadTime?: number; // 10 seconds by default ( 10000 )
}

export interface IGunEntity extends IWeapon {
    addAmmo(ammo: number): void;
    reloadMagazine(): void;
};