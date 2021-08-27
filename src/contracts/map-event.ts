import { IEntity } from "./entity";

export interface IMapEvent {
    type: string;
    activators: Array<IEntity>;
};