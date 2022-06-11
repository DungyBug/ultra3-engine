import { BaseModuleEvents } from "./module";
import { BasePhysicsModuleEvents } from "./modules/physics-module";

type WorldModuleEvents = BasePhysicsModuleEvents & BaseModuleEvents;

export default WorldModuleEvents;