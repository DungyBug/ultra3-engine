import WorldModuleEvents from "../core/contracts/world-module-events";
import { IWorldProps } from "../core/contracts/world-porps";
import { Registry } from "../core/registry";
import { World } from "../core/world";
import IClientWorld from "./contracts/client-world";
import { IViewableEntity } from "./contracts/entities/base/viewable";
import BaseGraphicsModule from "./contracts/modules/graphics-module";

class ClientWorld extends World implements IClientWorld {
    protected viewableEntities: Array<IViewableEntity>;
    protected graphicsModule: BaseGraphicsModule;

    constructor(props: IWorldProps, registry: Registry) {
        super(props, registry);

        this.viewableEntities = [];
    }

    setGraphicsModule(module: BaseGraphicsModule, width: number, height: number, fov: number): void {
        this.graphicsModule = module;
        this.graphicsModule.init({
            width,
            height,
            fov,
            context: this.context
        });
    }

    runRenderLoop() {
        this.context.emitter.emit("start");
    }

    runTick() {
        super.runTick();
    }
}

export default ClientWorld;
