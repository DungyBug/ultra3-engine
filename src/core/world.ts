import { IEntityConstructor } from "./contracts/entity";
import { IMapObject } from "./contracts/map-object";
import BaseModule from "./contracts/module";
import BaseModuleContext from "./contracts/module-context";
import BasePhysicsModule from "./contracts/modules/physics-module";
import { IWorld, IWorldState } from "./contracts/world";
import WorldModuleEvents from "./contracts/world-module-events";
import { IWorldProps } from "./contracts/world-porps";
import { Entity } from "./entity";
import { Registry } from "./registry";
import { MapObject } from "./map-object";
import { EventEmitter } from "./services/event-emitter";
import WorldEvents from "./contracts/world-events";

export class World<T extends Record<string, unknown[]> & WorldEvents = WorldEvents> extends EventEmitter<T> implements IWorld {
    protected _entities: Array<Entity> = [];
    protected _objects: Array<IMapObject> = [];
    protected _time: number = 0; // Global world time
    protected readonly _startTime: number = Date.now(); // World initialization time
    protected addedEntitiesCount: number = 0; // Increments every time a new entity has been added
    protected addedObjectsCount: number = 0;
    private thinkPeriod: number = 0;

    /**
     * 
     * @param worldProps - world properties ( see ```IWorldProps``` )
     * @param registry - registry for entities; contains entities classnames ( e.g. YourCoolEntity = "ent_coolent" )
     */
    constructor(worldProps: IWorldProps, private registry: Registry) {
        super();
        this.thinkPeriod = worldProps.thinkPeriod || null;

        this.runTick = this.runTick.bind(this);
    }

    get entities() {
        return this._entities;
    }

    get objects() {
        return this._objects;
    }

    registerClass(classname: string, classConstructor: IEntityConstructor) {
        this.registry.registerClass(classname, classConstructor);
    }

    addEntity(entity: Entity) {
        this._entities.push(entity);

        // Use a special variable to make ids of every entity unique.
        // If we use "this._entities.length", there could be situation,
        // when length of array decrements ( due to removing entities )
        // and new entity gets already existing id.
        return this.addedEntitiesCount++;
    }

    getEntity(id: number): Entity | null {
        for (let i = 0; i < this._entities.length; i++) {
            if (this._entities[i].id === id) {
                return this._entities[i];
            }
        }

        return null;
    }

    addObject(object: MapObject) {
        this._objects.push(object);
        this.emit("newObject", object);

        return this.addedObjectsCount++;
    }

    getObject(id: number): IMapObject | null {
        for (let i = 0; i < this._objects.length; i++) {
            if (this._objects[i].id === id) {
                return this._objects[i];
            }
        }

        return null;
    }

    getState() {
        const state: IWorldState = {
            entities: [],
            mapobjects: [],
        };

        for (const entity of this._entities) {
            state.entities.push(entity.getEntityState());
        }

        for (const mapObject of this._objects) {
            state.mapobjects.push(mapObject.getMapObjectState());
        }

        return state;
    }

    setState(state: IWorldState) {
        for (const entityState of state.entities) {
            const entity = this.getEntity(entityState.id);

            // Check if entity exists in world
            if (entity !== null) {
                entity.setEntityState(entityState);
            } else {
                const EntityConstructor = this.registry.getClass(
                    entityState.classname
                );

                // Check if EntityConstructor is already exists
                if (EntityConstructor !== undefined) {
                    const newEntity = new EntityConstructor(entityState, this);
                    newEntity.setEntityState(entityState);
                }
            }
        }

        for (const mapObjectState of state.mapobjects) {
            const object = this.getObject(mapObjectState.id);

            if (object !== null) {
                object.setMapObjectState(mapObjectState);
            }
        }
    }

    /**
     * deletePendingEntities
     * Deletes all entities that marked as "deleted" ( "delete" method called )
     */
    deletePendingEntities() {
        for (let i = 0; i < this._entities.length; i++) {
            if (this._entities[i].deleted) {
                this.emit("entityDelete", this._entities[i]);
                this._entities.splice(i, 1);
            }
        }

        // Delete all links to deleted entities
        for (let i = 0; i < this._entities.length; i++) {
            for (let j = 0; j < this._entities[i].links.length; j++) {
                if(this._entities[i].links[j].deleted) {
                    this._entities[i].unlink(this._entities[i].links[j]);
                }
            }
        }
    }

    runTick() {
        this.emit("framestart");

        this._time = Date.now() - this._startTime;

        this.deletePendingEntities();

        for (let i = 0; i < this._entities.length; i++) {
            this._entities[i].think();
        }

        for (let i = 0; i < this._objects.length; i++) {
            this._objects[i].think();
        }

        this.emit("frameend");

        if(this.thinkPeriod) {
            setTimeout(this.runTick, this.thinkPeriod);
        } else {
            requestAnimationFrame(this.runTick);
        }
    }

    getTime(): number {
        return this._time;
    }
}
