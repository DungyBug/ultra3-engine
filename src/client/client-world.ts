import { IWorldProps } from "../core/contracts/world-porps";
import { Registry } from "../core/registry";
import { World } from "../core/world";
import IClientWorld from "./contracts/client-world";
import { IViewableEntity } from "./contracts/entities/base/viewable";
import BaseRenderer from "./renderers/base-renderer";

class ClientWorld extends World implements IClientWorld {
    protected viewableEntities: Array<IViewableEntity>;
    protected renderer: BaseRenderer;

    constructor(
        props: IWorldProps,
        registry: Registry,
        renderer: BaseRenderer
    ) {
        super(props, registry);

        this.viewableEntities = [];
        this.renderer = renderer;
    }

    pushEntityToRenderQueue(entity: IViewableEntity): void {
        this.renderer.addMesh(entity.model);
        this.viewableEntities.push(entity);
    }

    runRenderLoop() {
        this.renderer.runRenderLoop();
    }

    runTick() {
        super.runTick();
    }
}

export default ClientWorld;
