import { IVector } from "./base/vector";

export interface IEntityParams {
    classname: string;
    pos?: IVector;
};

export interface IEntityState {
    id: number;
    pos: IVector;
    deleted: boolean;
    links: Array<number>;
    linkedKeys: Array<string>;
    nextthink: number;
    requestingState: number;
    currentState: number;
}

export interface IEntity {
    classname: string;
    id: number;
    pos: IVector;
    deleted: boolean; // To catch elements, that were deleted and delete them from world entities array
    links: Array<IEntity>; // If some properties changed in this entity, this properties will change in linked entities also ( like voodoo doll )
    linkedKeys: Array<string>; // Keys, that should be copied to linked objects
    nextthink: number;
    requestingState: number; // <enum> Requesting state to entity ( requesting idling, requesting shooting, requesting glowing and so on )
    currentState: number; // enum

    delete(): void;

    /**
     * Do the stuff you'd like to do.
     * Calls every frame.
     */
    think(): void;

    /**
     * Link entity
     * @param entity - entity to link to
     * @param linkMe - add to linked entities of entity this entity ( call "link" method from entity )
     */
    link(entity: IEntity, linkMe: boolean): void;
    
    /**
     * Unlink entity
     * @param entity - entity to link to
     * @param linkMe - add to linked entities of entity this entity ( call "link" method from entity )
     */
    unlink(entity: IEntity): void;

    /**
     * Requests state to entity
     * @param newState - state to be setted
     */
    setState(newState: number): void;

    /**
     * Returns current state of the entity with all protected and private properties.
     */
    getEntityState(): IEntityState;

    /**
     * Set current state of the entity.
     * @param state 
     */
    setEntityState(state: IEntityState): void;
}