import { EntityFromStateFabric, IEntityState } from "./contracts/entity";
import { Entity } from "./entity";
import { World } from "./world";

export class Registry<WORLD extends World = World> {
    private _classnames: Record<string, EntityFromStateFabric<Entity>>;

    constructor() {
        this._classnames = {};
    }

    /**
     * Registers entity classname and its constructor to the state
     * @param classname - entity classname start ( everything before underscore ) or full entity classname
     * @param classConstructor - entity class constructor
     */
    registerClass<T extends typeof Entity>(classname: string, classObject: T) {
        this._classnames[classname] = classObject.fromState;
    }

    getClass(classname: string, state: IEntityState, world: WORLD): Entity | null {
        const registryItem = this._classnames[classname];

        if(registryItem) {
            return registryItem(state, world);
        }

        return null;
    }
}
