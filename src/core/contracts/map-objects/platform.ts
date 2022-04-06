import { PlatformDirection } from "../../constants/platform-direction";
import { PlatformState } from "../../constants/platform-state/platform-state";
import { IVector } from "../base/vector";
import { IEntity } from "../entity";
import { IMapObject, IMapObjectProps, IMapObjectState } from "../map-object";
import { PreparedNetData } from "../prepared-net-data";
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
}

export interface IPlatformState extends IMapObjectState {
    props: PreparedNetData<IPlatformProps>;
    prevthink: number;
    nextthink: number;
    currentPathPos: number;
    speeds: Array<number>;
    state: PlatformState;
    origin: IVector;
    direction: PlatformDirection;
}
