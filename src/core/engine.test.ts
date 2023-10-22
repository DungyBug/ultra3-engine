import Engine from "./engine";
import { World } from "./world";
import { Registry } from "./registry";
import WorldEvents from "./contracts/world-events";
import TestModule from "./test-assets/test-module";

jest.mock("./test-assets/test-module");

describe("Engine", () => {
    it("should emit all world events", async () => {
        const world = new World({}, new Registry());
        const engine = new Engine(world);

        const events: Array<keyof WorldEvents> = [
            "entityDelete", "newEntity", "newObject", "frameend",
            "framestart", "entityDelete", "newEntity", "newObject",
            "frameend", "framestart"
        ];
        
        await Promise.all(events.map((event: keyof WorldEvents) => new Promise((res) => {
            engine.on(event, () => res(null));
            world.emit(event);
        })));
    }, 500);

    it("should add module and init it", () => {
        const world = new World({}, new Registry());
        const engine = new Engine(world);

        const module = new TestModule();

        engine.addModule(module);

        expect(module.init).toHaveBeenCalledTimes(1);
    });
});