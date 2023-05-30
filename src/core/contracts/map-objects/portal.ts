import { IMapObject, IMapObjectState } from "../map-object";

export interface IPortal extends IMapObject {
    connectTo(portal: IMapObject): void;

    get connection(): IMapObject | null;
}

export interface IPortalState extends IMapObjectState {
    connection: number;
}
