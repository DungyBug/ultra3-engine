import { Entity } from "../core/entity";
import { MapObject } from "../core/map-object";
import ISceneOpts from "./contracts/scene-opts";
import ClientMapObject from "./map/client-object";

class Scene<T extends Entity = Entity, U extends MapObject = MapObject> {
    protected readonly _entities: Array<T>;
    protected readonly _mapobjects: Array<ClientMapObject<U>>;

    constructor(opts: ISceneOpts<T, U> = {}) {
        this._entities = opts.entities || [];
        this._mapobjects = opts.mapobjects || [];
    }

    get entities(): Array<T> {
        return this._entities;
    }

    get mapobjects(): Array<ClientMapObject<U>> {
        return this._mapobjects;
    }

    addEntities(entities: Array<T>) {
        this._entities.push(...entities);
    }

    addMapObjects(mapobjects: Array<ClientMapObject<U>>) {
        this._mapobjects.push(...mapobjects);
    }

    pushEntity(entity: T) {
        this._entities.push(entity);
    }

    removeEntity(entity: T) {
        const index = this._entities.indexOf(entity);
        if(index === -1) {
            return;
        }

        this._entities.splice(index, 1);
    }

    pushMapObject(mapObject: ClientMapObject<U>) {
        this._mapobjects.push(mapObject);
    }

    static union<T extends Entity, U extends MapObject>(...scenes: Array<Scene<T, U>>): Scene<T, U> {
        const entities: Array<T> = [];
        const mapobjects: Array<ClientMapObject<U>> = [];

        for(const scene of scenes) {
            entities.push(...scene.entities);
            mapobjects.push(...scene.mapobjects);
        }

        return new Scene<T, U>({
            entities,
            mapobjects
        });
    }
}

export default Scene;