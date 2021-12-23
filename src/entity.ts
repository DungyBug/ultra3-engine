
import { IVector } from './contracts/base/vector';
import { IEntity, IEntityParams } from './contracts/entity';
import { IWorld } from './contracts/world';

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

    constructor(params: IEntityParams, world: IWorld) {
        this.classname = params.classname;
        this.pos = params.pos || {
            x: 0,
            y: 0,
            z: 0
        };
        this.deleted = false;
        this.links = [];
        this.linkedKeys = [];
        this.nextthink = 0;
        this.world = world;

        // Base entity class don't use states
        this.requestingState = 0;
        this.currentState = 0;

        this.world.addEntity(this);
    }

    delete() {
        this.deleted = false;
        
        // Unlink entities from this entity
        for(let i = 0; i < this.links.length; i++) {
            this.links[i].unlink(this); // Unlink self from other entities
        }
    }

    think() {
        // Do something
    }

    unlink(entity: IEntity) {
        let entityIndex = this.links.indexOf(entity);

        if(entityIndex !== -1) { // Check if entity is exists in our array
            this.links.splice(entityIndex, 1); // Unlink entity
        }
    }

    link(entity: IEntity, linkMe: boolean = false) {
        this.links.push(entity);

        if(linkMe) {
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
    };
};