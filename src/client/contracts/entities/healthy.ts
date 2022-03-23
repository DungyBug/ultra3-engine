import {
    IHealthyEntity,
    IHealthyEntityParams,
    IHealthyEntityState,
} from "../../../core/contracts/entities/healthy";
import { IViewableEntity, IViewableEntityParams } from "./base/viewable";

export type IClientHealthyEntityParams = IHealthyEntityParams &
    IViewableEntityParams;

interface IClientHealthyEntity extends IViewableEntity, IHealthyEntity {
    getEntityState(): IHealthyEntityState;
    setEntityState(state: IHealthyEntityState): void;
}

export default IClientHealthyEntity;
