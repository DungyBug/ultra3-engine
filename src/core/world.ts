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

export class World implements IWorld {
    entities: Array<Entity> = [];
    protected objects: Array<IMapObject> = [];
    protected _time: number = 0; // Global world time
    protected readonly _startTime: number = Date.now(); // World initialization time
    protected addedEntitiesCount: number = 0; // Increments every time a new entity has been added
    protected addedObjectsCount: number = 0;
    private thinkPeriod: number = 0;
    protected modules: Array<BaseModule>;
    protected physicsModule: BasePhysicsModule;
    protected context: BaseModuleContext<WorldModuleEvents>;

    constructor(worldProps: IWorldProps, private registry: Registry) {
        this.thinkPeriod = worldProps.thinkPeriod || 100 / 6;

        this.runTick = this.runTick.bind(this);
    }

    addModule(module: BaseModule): void {
        this.modules.push(module);
        module.init({
            context: this.context
        })
    }

    setPhysicsModule(module: BasePhysicsModule): void {
        this.physicsModule = module;
        this.physicsModule.init({
            context: this.context
        });
    }

    registerClass(classname: string, classConstructor: IEntityConstructor) {
        this.registry.registerClass(classname, classConstructor);
    }

    addEntity(entity: Entity) {
        this.entities.push(entity);

        // Use a special variable to make ids of every entity unique.
        // If we use "this.entities.length", there could be situation,
        // when length of array decrements ( due to removing entities )
        // and new entity gets already existing id.
        return this.addedEntitiesCount++;
    }

    getEntity(id: number): Entity | null {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].id === id) {
                return this.entities[i];
            }
        }

        return null;
    }

    addObject(object: MapObject) {
        this.objects.push(object);
        this.context.emitter.emit("newObject", object);

        return this.addedObjectsCount++;
    }

    getObject(id: number): IMapObject | null {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].id === id) {
                return this.objects[i];
            }
        }

        return null;
    }

    getState() {
        const state: IWorldState = {
            entities: [],
            mapobjects: [],
        };

        for (const entity of this.entities) {
            state.entities.push(entity.getEntityState());
        }

        for (const mapObject of this.objects) {
            state.mapobjects.push(mapObject.getMapObjectState());
        }

        return state;
    }

    setState(state: IWorldState) {
        console.log(state);

        for (const entityState of state.entities) {
            const entity = this.getEntity(entityState.id);
            console.log(entityState.id, entity);

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
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].deleted) {
                this.context.emitter.emit("entityDelete", this.entities[i]);
                this.entities.splice(i, 1);
            }
        }

        // Delete all links to deleted entities
        for (let i = 0; i < this.entities.length; i++) {
            for (let j = 0; j < this.entities[i].links.length; j++) {
                if(this.entities[i].links[j].deleted) {
                    this.entities[i].unlink(this.entities[i].links[j]);
                }
            }
        }
    }

    runTick() {
        this.context.emitter.emit("framestart");

        this._time = Date.now() - this._startTime;

        this.deletePendingEntities();

        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].think();
        }

        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].think();
        }

        this.context.emitter.emit("frameend");

        setTimeout(this.runTick, this.thinkPeriod);
    }

    getTime(): number {
        return this._time;
    }
}
