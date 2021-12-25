/*
PickableEntity

Type of PhysicalEntity

Can be picked
*/

import { IPickableEntity, IPickableEntityState } from "../../../core/contracts/entities/pickable";
import { IClientPhysicalEntity } from "./base/physical";


export interface IClientPickableEntity extends IClientPhysicalEntity, IPickableEntity {
    getEntityState(): IPickableEntityState;
    setEntityState(state: IPickableEntityState): void;
};