import { IVector } from "../base/vector";
import { IMapObject, IMapObjectProps } from "../map-object";

export interface IBaseTrainProps extends IMapObjectProps {
    end: boolean; // Is it end/start point of the train ( start acts as end in some cases )
}

export interface IBaseTrain extends IMapObject {
    readonly end: boolean;
    getPos(): IVector;
};