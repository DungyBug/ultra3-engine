import BaseModule from "./contracts/module";
import BaseModuleContext from "./contracts/module-context";
import BasePhysicsModule from "./contracts/modules/physics-module";
import WorldEvents from "./contracts/world-events";
import WorldModuleEvents from "./contracts/world-module-events";
import { EventEmitter } from "./services/event-emitter";
import { World } from "./world";

export default class Engine<
    T extends {[k: string]: unknown[]} & WorldEvents,
    WORLD extends World = World,
    EVENTS extends WorldModuleEvents = WorldModuleEvents
> extends EventEmitter<T> {
    protected _world: WORLD;
    protected modules: Array<BaseModule> = [];
    protected physicsModule: BasePhysicsModule | null = null;
    protected context: BaseModuleContext<EVENTS, WORLD>;

    constructor(world: WORLD) {
        super();
        this._world = world;

        this.context = new BaseModuleContext(new EventEmitter(), this._world);

        this._world.on("entityDelete", ent => this.emit("entityDelete", ent));
        this._world.on("newEntity", ent => this.emit("newEntity", ent));
        this._world.on("newObject", obj => this.emit("newObject", obj));
        this._world.on("frameend", () => this.emit("frameend"));
        this._world.on("framestart", () => this.emit("framestart"));
        this._world.on("entityDelete", ent => this.context.emitter.emit("entityDelete", ent));
        this._world.on("newEntity", ent => this.context.emitter.emit("newEntity", ent));
        this._world.on("newObject", obj => this.context.emitter.emit("newObject", obj));
        this._world.on("frameend", () => this.context.emitter.emit("frameend"));
        this._world.on("framestart", () => this.context.emitter.emit("framestart"));
    }

    get world() {
        return this._world;
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