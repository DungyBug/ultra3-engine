import { Entity } from "./entity";
import { Registry } from "./registry";
import { World } from "./world";
import { HealthyEntity } from "./entities/healthy";
import { PickableEntity } from "./entities/pickable";
import IBasePhysicalModel from "./contracts/base-physical-model";
import PhysicalModelType from "./constants/physical-model-type";
import Vector from "./lib/vector";
import { MapObject } from "./map-object";

const createPhysicalModel = (): IBasePhysicalModel => {
    return {
        type: PhysicalModelType.cube,
        shift: Vector.zero(),
        rotation: Vector.zero(),
        scale: new Vector(1, 1, 1)
    }
}

describe("World", () => {
    const registry = new Registry();

    const world = new World({
        repeatThink: false
    }, registry);

    it("should add entities", () => {
        // Entities are automatically added to the world
        const ent1 = new Entity({ classname: "entity" }, world);
        const ent2 = new Entity({ classname: "entity" }, world);
        const ent3 = new Entity({ classname: "entity" }, world);
    
        expect(world.entities).toEqual([ent1, ent2, ent3]);
    });

    it("should remove entity", () => {
        const [ent1, ent2, ent3] = world.entities as [Entity, Entity, Entity];

        // You can delete entity...
        ent2.delete();

        expect(world.entities).toEqual([ent1, ent2, ent3]);

        // ...and it'll be deleted in the next tick
        // simulate next tick
        world.runTick();

        expect(world.entities).toEqual([ent1, ent3]);

        // clear all entities for the next test
        world.entities.forEach(entity => entity.delete());
    });

    it("should get entity", () => {
        // Each entity has it's own unique ID. It generates automatically, when entity
        // is added to the world.
        // And as Entity has it's own unique ID, you can get entity by it's id.

        const [ent1, ent3] = world.entities as [Entity, Entity];

        // world.getEntity returns a link to the entity, so we can simply compare
        // links, without calling .toEqual
        expect(world.getEntity(ent1.id)).toBe(ent1);
        expect(world.getEntity(ent3.id)).toBe(ent3);
    });

    it("should return null when entity was not found", () => {
        // When entity with provided ID was not found, NULL is returned.

        // ent2 had id 1
        expect(world.getEntity(1)).toBe(null);

        // entity with id -1 couldn't be created
        expect(world.getEntity(-1)).toBe(null);

        // entity with id 3 hasn't created yet
        expect(world.getEntity(3)).toBe(null);
    });

    it("should add and get objects", () => {
        // The same goes for objects, except they can't be removed, i.e. objects are "constant".

        const obj1 = new MapObject(null, {
            name: "obj1",
            pos: Vector.zero(),
            rotation: Vector.zero(),
            scale: new Vector(1, 1, 1)
        }, world);

        const obj2 = new MapObject(null, {
            name: "obj1",
            pos: Vector.zero(),
            rotation: Vector.zero(),
            scale: new Vector(1, 1, 1)
        }, world);

        expect(world.objects).toEqual([obj1, obj2]);
        
        // world.getObject also return a link to the object
        expect(world.getObject(obj1.id)).toBe(obj1);
        expect(world.getObject(obj2.id)).toBe(obj2);
    });

    it("should register class and use it for parsing states", () => {
        // We link classnames to their entity classes like this...
        world.registerClass("healthy_entity", HealthyEntity);
        world.registerClass("pickable_entity", PickableEntity);

        const healthyEntity = new HealthyEntity({
            classname: "healthy_entity",
            health: 100
        }, world);

        const pickableEntity = new PickableEntity({
            classname: "pickable_entity",
            physicalModel: createPhysicalModel()
        }, world);

        const otherWorld = new World({}, registry);

        // ...this allows us to send state through imaginary network and be sure, that
        // other world will create entities with correct classes
        otherWorld.setState(world.getState());

        const [newHealthyEntity, newPickableEntity] = otherWorld.entities as [Entity, Entity];

        // newHealthyEntity will be instance of HealthyEntity
        // newPickableEntity will be instance of PickableEntity
        expect([
            newHealthyEntity instanceof HealthyEntity,
            newPickableEntity instanceof PickableEntity
        ]).toEqual([true, true]);

        // the ids are also copied
        expect(newHealthyEntity.id).toBe(healthyEntity.id);
        expect(newPickableEntity.id).toBe(pickableEntity.id);
    });

    it("should return correct time", async () => {
        // You can get current world time with method world.getTime.
        // It simply calculates time past since calling World's constructor and returns it.

        const testWorld = new World({repeatThink: false}, registry);

        const startTime = Date.now();

        await new Promise(res => setTimeout(res, 500));

        // Time updates with ticks
        testWorld.runTick();

        // In some rare cases a whole millisecond ticks during execution this line of code.
        // In result, this leads to failed test despite testWorld.getTime() works perfectly.
        expect(testWorld.getTime() / 1000).toBeCloseTo((Date.now() - startTime) / 1000, 2);
    });
});