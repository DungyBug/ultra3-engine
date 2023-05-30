import { EventEmitter } from "../services/event-emitter";
import { World } from "../world";

export default class BaseModuleContext<T extends Record<string, any[]>, WORLD extends World = World> {
    constructor(public emitter: EventEmitter<T>, public world: WORLD) {};
}