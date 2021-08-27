/*
PickableEntity

Type of PhysicalEntity

Can be picked
*/

import { IEntity } from '../entity';
import { IPhysicalEntity } from './base/physical';

export interface IPickableEntity extends IPhysicalEntity {
    pick(by: IEntity): void;
    unpick(): void;
};