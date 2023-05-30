import { IVector } from "./base/vector";
import { IMapEvent } from "./map-event";
import IPhysicalMesh from "./physical-mesh";

export interface IMapObjectProps {
    name: string;
    // TODO: Add render props
    rotation: IVector;
    pos: IVector;
    scale: IVector;
}

export interface IMapObject {
    id: number;

    // shape: string; // IShape
    // props: IMapObjectProps;
    // state: number;

    activate(): void; // Calls when player triggers a trigger, connected to this object
    emit(event: string, e: IMapEvent): void;
    on(event: string, callback: (e: IMapEvent) => void): void;
    getProps(): IMapObjectProps;
    getShape(): IPhysicalMesh | null;
    getState(): number;
    setMapObjectState(state: IMapObjectState): void;
    getMapObjectState(): IMapObjectState;
    think(): void;
}

export interface IMapObjectState {
    id: number;
    props: IMapObjectProps;
    state: number;
    targets: Array<number>;
}
