import { IHealthyEntity, IHealthyEntityParams, IHealthyEntityState } from './healthy';
import { IPickableEntity } from './pickable';

export interface IPlayerParams extends IHealthyEntityParams {}

export interface IPlayerState extends IHealthyEntityState {
    inventory: Array<number>;
}

export interface IPlayer extends IHealthyEntity {
    pick(entity: IPickableEntity): void;
    unpick(entity: IPickableEntity): void;

    getEntityState(): IPlayerState;
    setEntityState(state: IPlayerState): void;
};