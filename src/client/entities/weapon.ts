import { Weapon } from "../../core/entities/weapon";
import ClientWorld from "../client-world";
import {
    IClientWeapon,
    IClientWeaponParams,
} from "../contracts/entities/weapon";
import IMesh from "../contracts/mesh";

class ClientWeapon extends Weapon implements IClientWeapon {
    model: IMesh;

    constructor(params: IClientWeaponParams, world: ClientWorld) {
        super(params, world);

        this.model = params.model;

        world.pushEntityToRenderQueue(this);
    }
}

export default ClientWeapon;
