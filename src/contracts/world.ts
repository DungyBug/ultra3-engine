import { IEntity } from "./entity";

export interface IWorld {
    entities: Array<IEntity>;

    // TODO: add description
    addEntity(entity: IEntity): void;
    deletePendingEntities(): void;
    runTick(): void;
    getTime(): number;
};