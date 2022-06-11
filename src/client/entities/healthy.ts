import { HealthyEntity } from "../../core/entities/healthy";
import ClientWorld from "../client-world";
import IClientHealthyEntity, {
    IClientHealthyEntityParams,
} from "../contracts/entities/healthy";
import IMesh from "../contracts/mesh";

class ClientHealthyEntity
    extends HealthyEntity
    implements IClientHealthyEntity
{
    model: IMesh;

    constructor(params: IClientHealthyEntityParams, world: ClientWorld) {
        super(params, world);
        this.model = params.model;
    }
}

export default ClientHealthyEntity;
