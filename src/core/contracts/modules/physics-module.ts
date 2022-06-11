import { Entity } from "../../entity";
import { MapObject } from "../../map-object";
import BaseModule, { BaseModuleEvents } from "../module";
import IWorldPhysics from "./physics-parameters";

export type BasePhysicsModuleEvents = {
    newEntity: [Entity];
    entityDelete: [Entity];
    newObject: [MapObject];
} & BaseModuleEvents;

export default abstract class BasePhysicsModule<T extends Record<string, any[]> = {}> extends BaseModule<T & BasePhysicsModuleEvents> {
    abstract setPhysicsParameters(parameters: IWorldPhysics): void;
    abstract enable(): void;
    abstract disable(): void;
}