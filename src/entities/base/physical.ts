import { World } from "../../world";
import { PhysicalActivity } from "../../constants/physical-activity";
import { IPhysicalEntity, IPhysicalEntityParams } from "../../contracts/entities/base/physical";
import IBasePhysicalModel from "../../contracts/base-physical-model";
import { Entity } from "../../entity";

export class PhysicalEntity extends Entity implements IPhysicalEntity {
    physicalModel: IBasePhysicalModel;
    activity: PhysicalActivity;
    weight: number;

    constructor(params: IPhysicalEntityParams, world: World) {
        super(params, world);
        this.physicalModel = params.physicalModel;
        this.activity = params.activity || PhysicalActivity.active;
        this.weight = params.weight || 0;
    }
};