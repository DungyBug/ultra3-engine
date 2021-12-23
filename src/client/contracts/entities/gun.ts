import { IGunEntity, IGunEntityParams } from "../../../contracts/entities/gun";
import { IViewableEntityParams } from "./base/viewable";
import { IClientWeapon } from "./weapon";

export type IClientGunEntityParams = IGunEntityParams & IViewableEntityParams;

interface IClientGunEntity extends IClientWeapon, IGunEntity {};

export default IClientGunEntity;