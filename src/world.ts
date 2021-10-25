import { IMapObject } from "./contracts/map-object";
import { IWorld } from "./contracts/world";
import { IWorldProps } from "./contracts/world-porps";
import { Entity } from "./entity";

export class World implements IWorld {
    entities: Array<Entity> = [];
    protected objects: Array<IMapObject> = [];
    protected _time: number = 0; // Global world time
    protected readonly _startTime: number = Date.now(); // World initialization time

    constructor(protected readonly _worldProps: IWorldProps = { gravity: 9.81 }) {}

    addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    addObject(object: IMapObject) {
        this.objects.push(object);
    }

    /**
     * deletePendingEntities
     * Deletes all entities that marked as "deleted" ( "delete" method called )
     */
    deletePendingEntities() {
        for(let i = 0; i < this.entities.length; i++) {
            if(this.entities[i].deleted) {
                this.entities.splice(i, 1);
            }
        }
    }

    runTick() {
        this._time = Date.now() - this._startTime;

        this.deletePendingEntities();

        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].think();
        }

        for(let i = 0; i < this.objects.length; i++) {
            this.objects[i].think();
        }

        requestAnimationFrame(this.runTick);
    }

    getTime(): number {
        return this._time;
    }
};