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

export class World<T extends {[key: string]: unknown[]} & WorldEvents = WorldEvents> extends EventEmitter<T> implements IWorld {
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
        this.thinkPeriod = worldProps.thinkPeriod || 0;
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
        this.emit("newEntity", entity);

        // Use a special variable to make ids of every entity unique.
        // If we use "this._entities.length", there could be situation,
        // when length of array decrements ( due to removing entities )
        // and new entity gets already existing id.
        return this.addedEntitiesCount++;
    }

    getEntity(id: number): Entity | null {
        for (const entity of this._entities) {
            if (entity.id === id) {
                return entity;
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
        for (const object of this._objects) {
            if (object.id === id) {
                return object;
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
        this._entities.forEach((entity, i) => {
            if (entity.deleted) {
                this.emit("entityDelete", entity);
                this._entities.splice(i, 1);
            }
        });

        // Delete all links to deleted entities
        for (const entity of this._entities) {
            for (const link of entity.links) {
                if(link.deleted) {
                    entity.unlink(link);
                }
            }
        }
    }

    runTick() {
        this.emit("framestart");

        this._time = Date.now() - this._startTime;

        this.deletePendingEntities();

        for (const entity of this._entities) {
            entity.think();
        }

        for (const object of this._objects) {
            object.think();
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