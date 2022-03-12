import { IVector } from "./contracts/base/vector";
import { IEntity, IEntityParams, IEntityState } from "./contracts/entity";
import { IWorld } from "./contracts/world";

export class Entity implements IEntity {
    readonly classname: string;
    pos: IVector;
    deleted: boolean;
    links: Array<IEntity>;
    linkedKeys: Array<string>;
    nextthink: number;
    requestingState: number; // <enum> Requesting state to entity ( requesting idling, requesting shooting, requesting glowing and so on )
    currentState: number; // enum
    world: IWorld;
    id: number;

    constructor(params: IEntityParams, world: IWorld) {
        this.classname = params.classname;
        this.pos = params.pos || {
            x: 0,
            y: 0,
            z: 0,
        };
        this.deleted = false;
        this.links = [];
        this.linkedKeys = [];
        this.nextthink = 0;
        this.world = world;

        // Base entity class don't use states
        this.requestingState = 0;
        this.currentState = 0;

        this.id = this.world.addEntity(this);
    }

    delete() {
        this.deleted = false;

        // Unlink entities from this entity
        for (let i = 0; i < this.links.length; i++) {
            this.links[i].unlink(this); // Unlink self from other entities
        }
    }

    think() {
        // Do nothing
    }

    unlink(entity: IEntity) {
        let entityIndex = this.links.indexOf(entity);

        if (entityIndex !== -1) {
            // Check if entity is exists in our array
            this.links.splice(entityIndex, 1); // Unlink entity
        }
    }

    link(entity: IEntity, linkMe: boolean = false) {
        this.links.push(entity);

        if (linkMe) {
            entity.link(this, false);
        }
    }

    /**
     * setState
     * @param newState - state to be setted
     * Requests state to entity
     */
    setState(newState: number) {
        this.requestingState = newState;
    }

    getEntityState(): IEntityState {
        let links = [];

        for (let i = 0; i < this.links.length; i++) {
            links.push(this.links[i].id);
        }

        return {
            classname: this.classname,
            id: this.id,
            pos: this.pos,
            deleted: this.deleted,
            links: links,
            linkedKeys: this.linkedKeys,
            nextthink: this.nextthink,
            requestingState: this.requestingState,
            currentState: this.currentState,
        };
    }

    setEntityState(state: IEntityState): void {
        this.id = state.id;
        // Separate setting values to prevent variable linking
        this.pos.x = state.pos.x;
        this.pos.y = state.pos.y;
        this.pos.z = state.pos.z;
        this.deleted = state.deleted;
        this.links = [];
        this.linkedKeys = [];

        for (let i = 0; i < state.links.length; i++) {
            this.links.push(this.world.getEntity(state.links[i]));
        }

        for (let j = 0; j < state.linkedKeys.length; j++) {
            this.linkedKeys[j] = state.linkedKeys[j];
        }

        this.nextthink = state.nextthink;
        this.requestingState = state.requestingState;
        this.currentState = state.currentState;
    }
}
