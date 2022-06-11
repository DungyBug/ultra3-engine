import BaseModuleContext from "./module-context";

export type BaseModuleEvents = {
    start: [],
    framestart: unknown[],
    frameend: unknown[]
};

export default abstract class BaseModule<T extends Record<string, any[]> = {}> {
    protected context: BaseModuleContext<T & BaseModuleEvents>;

    // TODO: Add type to extenders
    constructor(extenders: Array<any> = []) {}

    init(parameters: {context: BaseModuleContext<T & BaseModuleEvents>}): void {
        this.context = parameters.context;
    }
}