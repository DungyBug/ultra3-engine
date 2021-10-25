import { IEntity } from "../entity";
import { IMapEvent } from "../map-event";

/*
TriggerEvent
Emits, when object triggers by connected to it trigger
*/
export interface ITriggerEvent extends IMapEvent {
    type: "trigger",
    triggerEvent: IMapEvent; // Event that triggered trigger
}