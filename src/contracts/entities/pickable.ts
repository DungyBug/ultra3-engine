/*
PickableEntity

Type of PhysicalEntity

Can be picked
*/

import { IEntity } from '../entity';
import { IPhysicalEntity, IPhysicalEntityState } from './base/physical';

export interface IPickableEntityState extends IPhysicalEntityState {
    owner: number;
    picked: boolean;
}

export interface IPickableEntity extends IPhysicalEntity {
    pick(by: IEntity): void;
    unpick(): void;

    getEntityState(): IPickableEntityState;
    setEntityState(state: IPickableEntityState): void;
};