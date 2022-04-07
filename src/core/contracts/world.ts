import { IEntity, IEntityState } from "./entity";
import { IMapObjectState } from "./map-object";

export interface IWorldState {
    // TODO: addedEntitiesCount...
    entities: Array<IEntityState>;
    mapobjects: Array<IMapObjectState>;
}

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
    setState(state: IWorldState): void;
    getState(): IWorldState;
    runTick(): void;
    getTime(): number;
}
