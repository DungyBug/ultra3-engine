import { IMapObject, IMapObjectState } from "../map-object";

export interface IPortal extends IMapObject {
    connectTo(portal: IMapObject): void;

    get connection(): IMapObject;
}

export interface IPortalState extends IMapObjectState {
    connection: number;
}
