import { IEntityConstructor } from "./contracts/entity";
import { IMapObject } from "./contracts/map-object";
import { IWorld, IWorldState } from "./contracts/world";
import { IWorldProps } from "./contracts/world-porps";
import { Entity } from "./entity";
import { Registry } from "./registry";

export class World implements IWorld {
    entities: Array<Entity> = [];
    protected objects: Array<IMapObject> = [];
    protected _time: number = 0; // Global world time
    protected readonly _startTime: number = Date.now(); // World initialization time
    protected addedEntitiesCount: number = 0; // Increments every time a new entity has been added
    private thinkPeriod: number = 0;

    constructor(worldProps: IWorldProps, private registry: Registry) {
        this.thinkPeriod = worldProps.thinkPeriod || 100 / 6;

        this.runTick = this.runTick.bind(this);
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

    addObject(object: IMapObject) {
        this.objects.push(object);
    }

    getState() {
        const state: IWorldState = {
            entities: [],
            mapobjects: [],
        };

        for (const entity of this.entities) {
            state.entities.push(entity.getEntityState());
        }

        return state;
    }

    setState(state: IWorldState) {
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
    }

    /**
     * deletePendingEntities
     * Deletes all entities that marked as "deleted" ( "delete" method called )
     */
    deletePendingEntities() {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].deleted) {
                this.entities.splice(i, 1);
            }
        }
    }

    runTick() {
        this._time = Date.now() - this._startTime;

        this.deletePendingEntities();

        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].think();
        }

        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].think();
        }

        setTimeout(this.runTick, this.thinkPeriod);
    }

    getTime(): number {
        return this._time;
    }
}
