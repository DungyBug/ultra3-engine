import { IVector } from "./base/vector";
import { IMapEvent } from "./map-event";

export interface IMapObjectProps {
    name: string;
    targets: Array<string>;
    // TODO: Add render props
    rotation: IVector;
    pos: IVector;
    scale: IVector;
};

export interface IMapObject {
    // shape: string; // IShape
    // props: IMapObjectProps;
    // state: number;

    activate(): void; // Calls when player triggers a trigger, connected to this object
    connect(name: string): void;
    emit(event: string, e: IMapEvent): Array<boolean>;
    on(event: string, callback: (e: IMapEvent) => boolean): void;
    getProps(): IMapObjectProps;
    getShape(): string;
    getState(): number;
    think(): void;
};