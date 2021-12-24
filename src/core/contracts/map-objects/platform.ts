import { IEntity } from "../entity";
import { IMapObject, IMapObjectProps } from "../map-object";
import { ITrainStart } from "./train-start";

export interface IPlatformProps extends IMapObjectProps {
    speed: number;
    train: ITrainStart;
}

export interface IPlatform extends IMapObject {
    setTrain(train: ITrainStart): void; // Pass train starts
    startMoving(by: IEntity): void;
    stopMoving(by: IEntity): void;
    /**
     * 
     * @param speeds - Array of speeds for trains
     * Sets separate speeds for separate train nodes
     */
    setPathSpeeds(speeds: Array<number>): void;
};