import { IVector } from "./base/vector";

export interface IEntityParams {
    classname: string;
    pos?: IVector;
};

export interface IEntity {
    classname: string;
    pos: IVector;
    deleted: boolean; // To catch elements, that were deleted and delete them from world entities array
    links: Array<IEntity>; // If some properties changed in this entity, this properties will changed in linked entities also ( like voodoo doll )
    linkedKeys: Array<string>; // Keys, that should be copied to linked objects
    nextthink: number;
    requestingState: number; // <enum> Requesting state to entity ( requesting idling, requesting shooting, requesting glowing and so on )
    currentState: number; // enum

    delete(): void;

    /**
     * think
     * Do the stuff you'd like to do
     * Calls every frame
     * For example: damage, fly, shoot and so on
     */
    think(): void;

    /**
     * link
     * @param entity - entity to link to
     * @param linkMe - add to linked entities of entity this entity ( call "link" method from entity )
     */
    link(entity: IEntity, linkMe: boolean): void;
    
    /**
     * unlink
     * @param entity - entity to link to
     * @param linkMe - add to linked entities of entity this entity ( call "link" method from entity )
     */
    unlink(entity: IEntity): void;

    /**
     * setState
     * @param newState - state to be setted
     * Requests state to entity
     */
    setState(newState: number): void;
}