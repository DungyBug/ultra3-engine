import { IGunEntityParams, IGunEntity, GunEntityState } from "../../../core/contracts/entities/gun";
import { IViewableEntityParams } from "./base/viewable";
import { IClientWeapon } from "./weapon";

export type IClientGunEntityParams = IGunEntityParams & IViewableEntityParams;

interface IClientGunEntity extends IClientWeapon, IGunEntity {
    getEntityState(): GunEntityState;
    setEntityState(state: GunEntityState): void;
};

export default IClientGunEntity;