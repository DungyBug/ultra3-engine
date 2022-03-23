import { IWorld } from "../../core/contracts/world";
import { IViewableEntity } from "./entities/base/viewable";

interface IClientWorld extends IWorld {
    pushEntityToRenderQueue(entity: IViewableEntity): void; // Add viewable entity to render queue. You don't need to call it manually as it does ViewableEntity constructor
}

export default IClientWorld;
