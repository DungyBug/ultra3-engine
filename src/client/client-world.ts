import { IWorld } from "../core/contracts/world";
import { IWorldProps } from "../core/contracts/world-porps";
import { Registry } from "../core/registry";
import { World } from "../core/world";
import ClientWorldEvents from "./contracts/client-world-events";
import { IViewableEntity } from "./contracts/entities/base/viewable";
import ClientMapObject from "./map/client-object";

class ClientWorld<T extends Record<string, unknown[]> & ClientWorldEvents = ClientWorldEvents> extends World<T> implements IWorld {
    readonly clientMapObjects: Array<ClientMapObject>;
    protected viewableEntities: Array<IViewableEntity>;
    
    constructor(props: IWorldProps, registry: Registry) {
        super(props, registry);

        this.viewableEntities = [];
        this.clientMapObjects = [];
    }

    addClientMapObject(object: ClientMapObject): void {
        this.clientMapObjects.push(object);
        this.emit("clientmapobject", object);
    }

    runTickLoop() {
        this.emit("start");
        this.runTick();
    }

    runTick() {
        super.runTick();
    }
}

export default ClientWorld;
