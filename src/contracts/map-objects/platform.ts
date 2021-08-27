import { IEntity } from "../entity";
import { IMapObject } from "../map-object";
import { ITrainStart } from "./train-start";

export interface IPlatform extends IMapObject {
    setTrain(train: ITrainStart): void; // Pass train starts
    startMoving(by: IEntity): void;
    stopMoving(by: IEntity): void;
};