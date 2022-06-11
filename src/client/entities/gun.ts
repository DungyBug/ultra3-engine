import { GunEntity } from "../../core/entities/gun";
import ClientWorld from "../client-world";
import IClientGunEntity, {
    IClientGunEntityParams,
} from "../contracts/entities/gun";
import IMesh from "../contracts/mesh";

class ClientGunEntity extends GunEntity implements IClientGunEntity {
    model: IMesh;

    constructor(params: IClientGunEntityParams, world: ClientWorld) {
        super(params, world);
        this.model = params.model;
    }
}

export default ClientGunEntity;
