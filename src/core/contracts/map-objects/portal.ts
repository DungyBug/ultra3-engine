import { IMapObject } from "../map-object";

export interface IPortal extends IMapObject {
    connectTo(portal: IMapObject): void;

    get connection(): IMapObject;
};