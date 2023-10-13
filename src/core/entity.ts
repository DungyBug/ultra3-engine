import { IVector } from "./contracts/base/vector";
import { IEntity, IEntityParams, IEntityState } from "./contracts/entity";
import { IWorld } from "./contracts/world";
import { World } from "./world";

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
        this.deleted = true;

        // Unlink entities from this entity
        for (const link of this.links) {
            link.unlink(this); // Unlink self from other entities
        }
    }

    /**
     * Does the stuff entity should do. Example: EnemyEntity watches for player and shoots him.
     * Calls every frame.
     */
    think() {
        // Do nothing
    }

    unlink(entity: IEntity) {
        const entityIndex = this.links.indexOf(entity);
        
        // Check if entity exists in our array
        if (entityIndex !== -1) {
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

    /**
     * Returns current state of the entity with all protected and private properties.
     */
    getEntityState(): IEntityState {
        let links = [];

        for (const link of this.links) {
            links.push(link.id);
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

    /**
     * Set current state of the entity.
     * @param state
     */
    setEntityState(state: IEntityState): void {
        this.id = state.id;
        // Separate setting values to prevent variable linking
        this.pos.x = state.pos.x;
        this.pos.y = state.pos.y;
        this.pos.z = state.pos.z;
        this.deleted = state.deleted;
        this.links = [];
        this.linkedKeys = [];

        for (const link of state.links) {
            const entity = this.world.getEntity(link);

            if(entity !== null) {
                this.links.push();
            }
        }

        state.linkedKeys.forEach((linkedKey, i) => {
            this.linkedKeys[i] = linkedKey;
        });
        
        this.nextthink = state.nextthink;
        this.requestingState = state.requestingState;
        this.currentState = state.currentState;
    }

    /**
     * Create entity from it's state and world
     * @param state - entity state
     * @param world - world where to place entity
     */
    static fromState(state: IEntityState, world: World): Entity {
        const entity = new Entity({classname: state.classname}, world);

        entity.setEntityState(state);

        return entity;
    }
}
