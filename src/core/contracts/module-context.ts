import { EventEmitter } from "../services/event-emitter";
import { World } from "../world";

export default class BaseModuleContext<T extends Record<string, any[]>> {
    constructor(public emitter: EventEmitter<T>, public world: World) {};
}