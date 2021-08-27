import { World } from "../../world";
import { PhysicalActivity } from "../../constants/physical-activity";
import { IPhysicalEntity, IPhysicalEntityParams } from "../../contracts/entities/base/physical";
import { ViewableEntity } from "./viewable";

export class PhysicalEntity extends ViewableEntity implements IPhysicalEntity {
    physicalModel: string; // Path
    activity: PhysicalActivity;
    weight: number;

    constructor(params: IPhysicalEntityParams, world: World) {
        super(params, world);
        this.physicalModel = params.physicalModel;
        this.activity = params.activity || PhysicalActivity.active;
        this.weight = params.weight || 1;
    }
};