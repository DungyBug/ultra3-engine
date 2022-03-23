import {
    IPlayer,
    IPlayerParams,
    IPlayerState,
} from "../../../core/contracts/entities/player";
import { IViewableEntityParams } from "./base/viewable";
import IClientHealthyEntity from "./healthy";

export type IClientPlayerParams = IPlayerParams & IViewableEntityParams;

interface IClientPlayer extends IClientHealthyEntity, IPlayer {
    getEntityState(): IPlayerState;
    setEntityState(state: IPlayerState): void;
}

export default IClientPlayer;
