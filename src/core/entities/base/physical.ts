import { World } from "../../world";
import { PhysicalActivity } from "../../constants/physical-activity";
import { IPhysicalEntity, IPhysicalEntityParams, IPhysicalEntityState } from "../../contracts/entities/base/physical";
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

    getEntityState(): IPhysicalEntityState {
        let parentState = super.getEntityState();

        return {
            ...parentState,
            // To prevent variable linking
            physicalModel: {
                type: this.physicalModel.type,
                shift: {
                    x: this.physicalModel.shift.x,
                    y: this.physicalModel.shift.y,
                    z: this.physicalModel.shift.z
                },
                rotation: {
                    x: this.physicalModel.rotation.x,
                    y: this.physicalModel.rotation.y,
                    z: this.physicalModel.rotation.z
                },
                scale: {
                    x: this.physicalModel.scale.x,
                    y: this.physicalModel.scale.y,
                    z: this.physicalModel.scale.z
                }
            },
            activity: this.activity,
            weight: this.weight
        };
    }

    setEntityState(state: IPhysicalEntityState): void {
        super.setEntityState(state);

        // To prevent variable linking
        this.physicalModel.type = state.physicalModel.type;
        this.physicalModel.shift.x = state.physicalModel.shift.x;
        this.physicalModel.shift.y = state.physicalModel.shift.y;
        this.physicalModel.shift.z = state.physicalModel.shift.z;
        this.physicalModel.rotation.x = state.physicalModel.rotation.x;
        this.physicalModel.rotation.y = state.physicalModel.rotation.y;
        this.physicalModel.rotation.z = state.physicalModel.rotation.z;
        this.physicalModel.scale.x = state.physicalModel.scale.x;
        this.physicalModel.scale.y = state.physicalModel.scale.y;
        this.physicalModel.scale.z = state.physicalModel.scale.z;
        this.activity = state.activity;
        this.weight = state.weight;
    }

    static fromState(state: IPhysicalEntityState, world: World): PhysicalEntity {
        const entity = new PhysicalEntity(state, world);

        entity.setEntityState(state);

        return entity;
    }
};