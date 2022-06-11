import { Entity } from "../../../core/entity";
import { MapObject } from "../../../core/map-object";
import { IVector } from "../../../core/contracts/base/vector";
import BaseModule, { BaseModuleEvents } from "../../../core/contracts/module";
import BaseModuleContext from "../../../core/contracts/module-context";
import IGraphicsParameters from "./graphics-parameters";

export type BaseGraphicsModuleEvents = {
    newEntity: [Entity];
    entityDelete: [Entity];
    newObject: [MapObject];
} & BaseModuleEvents;

export default abstract class BaseGraphicsModule<T extends Record<string, any[]> = {}> extends BaseModule<T & BaseGraphicsModuleEvents> {
    init(parameters: IGraphicsParameters & {context: BaseModuleContext<T & BaseModuleEvents>}): void {
        this.context = parameters.context;
    }

    abstract setCameraPosition(pos: IVector): void;
    abstract setCameraRotation(angle: IVector): void;
}