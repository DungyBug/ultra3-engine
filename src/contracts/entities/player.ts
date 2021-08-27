import { IHealthyEntity, IHealthyEntityParams } from './healthy';
import { IPickableEntity } from './pickable';

export interface IPlayerParams extends IHealthyEntityParams {
    classname: "player";
}

export interface IPlayer extends IHealthyEntity {
    pick(entity: IPickableEntity): void;
    unpick(entity: IPickableEntity): void;
};