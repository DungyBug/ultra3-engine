import { IWorld } from "../../core/contracts/world";
import BaseGraphicsModule from "./modules/graphics-module";

interface IClientWorld extends IWorld {
    setGraphicsModule(module: BaseGraphicsModule, width: number, height: number, fov: number): void;
}

export default IClientWorld;
