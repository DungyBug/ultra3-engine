import { GunEntityState } from "../../core/contracts/entities/gun";
import { GunEntity } from "../../core/entities/gun";
import ClientWorld from "../client-world";
import IClientGunEntity, {
    IClientGunEntityParams,
} from "../contracts/entities/gun";
import IMesh from "../contracts/mesh";

class ClientGunEntity extends GunEntity implements IClientGunEntity {
    model: IMesh | null;

    constructor(params: IClientGunEntityParams, world: ClientWorld) {
        super(params, world);
        this.model = params.model;
    }

    static fromState(state: GunEntityState, world: ClientWorld): ClientGunEntity {
        const entity = new ClientGunEntity({...state, model: null}, world);

        entity.setEntityState(state);

        return entity;
    }
}

export default ClientGunEntity;
