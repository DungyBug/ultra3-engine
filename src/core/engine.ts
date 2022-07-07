import BaseModule from "./contracts/module";
import BaseModuleContext from "./contracts/module-context";
import BasePhysicsModule from "./contracts/modules/physics-module";
import WorldEvents from "./contracts/world-events";
import WorldModuleEvents from "./contracts/world-module-events";
import { EventEmitter } from "./services/event-emitter";
import { World } from "./world";

export default class Engine<T extends Record<string, unknown[]> & WorldEvents> extends EventEmitter<T> {
    protected world: World;
    protected modules: Array<BaseModule>;
    protected physicsModule: BasePhysicsModule;
    protected context: BaseModuleContext<WorldModuleEvents>;

    constructor(world: World) {
        super();
        this.world = world;

        this.context = new BaseModuleContext(new EventEmitter(), this.world);

        this.world.on("entityDelete", ent => this.emit("entityDelete", ent));
        this.world.on("newEntity", ent => this.emit("newEntity", ent));
        this.world.on("newObject", obj => this.emit("newObject", obj));
        this.world.on("frameend", () => this.emit("frameend"));
        this.world.on("framestart", () => this.emit("framestart"));
        this.world.on("entityDelete", ent => this.context.emitter.emit("entityDelete", ent));
        this.world.on("newEntity", ent => this.context.emitter.emit("newEntity", ent));
        this.world.on("newObject", obj => this.context.emitter.emit("newObject", obj));
        this.world.on("frameend", () => this.context.emitter.emit("frameend"));
        this.world.on("framestart", () => this.context.emitter.emit("framestart"));
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
}