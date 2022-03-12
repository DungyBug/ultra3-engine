import { IEntityConstructor } from "./contracts/entity";

export class Registry {
    private _classnames: Record<string, IEntityConstructor>;

    /**
     * Registers entity classname and its constructor to the state
     * @param classname - entity classname start ( everything before underscore ) or full entity classname
     * @param classConstructor - entity class constructor
     */
    registerClass(classname: string, classConstructor: IEntityConstructor) {
        this._classnames[classname] = classConstructor;
    }

    getClass(classname: string): IEntityConstructor | undefined {
        return this._classnames[classname];
    }
}
