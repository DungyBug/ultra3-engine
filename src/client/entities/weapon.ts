import { IWeaponState } from "../../core/contracts/entities/weapon";
import { Weapon } from "../../core/entities/weapon";
import ClientWorld from "../client-world";
import {
    IClientWeapon,
    IClientWeaponParams,
} from "../contracts/entities/weapon";
import IMesh from "../contracts/mesh";

class ClientWeapon extends Weapon implements IClientWeapon {
    model: IMesh | null;

    constructor(params: IClientWeaponParams, world: ClientWorld) {
        super(params, world);
        this.model = params.model;
    }

    static fromState(state: IWeaponState, world: ClientWorld): ClientWeapon {
        const entity = new ClientWeapon({...state, model: null}, world);

        entity.setEntityState(state);

        return entity;
    }
}

export default ClientWeapon;
