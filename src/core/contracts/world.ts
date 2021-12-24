import { IEntity } from "./entity";

export interface IWorld {
    entities: Array<IEntity>;

    /**
     * Adds entity to the world.
     * The main Entity class already adds itself to the world.
     * @param entity - entity to be added
     * @returns id of the entity
     */
    addEntity(entity: IEntity): number;
    getEntity(id: number): IEntity | null;
    deletePendingEntities(): void;
    runTick(): void;
    getTime(): number;
};