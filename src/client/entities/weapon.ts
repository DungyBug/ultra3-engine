import { Weapon } from "../../entities/weapon";
import { World } from "../../world";
import { IClientWeapon, IClientWeaponParams } from "../contracts/entities/weapon";
import IMesh from "../contracts/mesh";

class ClientWeapon extends Weapon implements IClientWeapon {
    model: IMesh;

    constructor(params: IClientWeaponParams, world: World) {
        super(params, world);
        
        this.model = params.model;
    }
}

export default ClientWeapon;