import { GunEntity } from "../../entities/gun";
import { World } from "../../world";
import IClientGunEntity, { IClientGunEntityParams } from "../contracts/entities/gun";
import IMesh from "../contracts/mesh";

class ClientGunEntity extends GunEntity implements IClientGunEntity {
    model: IMesh;

    constructor(params: IClientGunEntityParams, world: World) {
        super(params, world);
        
        this.model = params.model;
    }
}

export default ClientGunEntity;