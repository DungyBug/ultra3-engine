import { Side } from "../../constants/side";
import { IMapEvent } from "../map-event";

/*
CameoutMapEvent
Emits when player cames out from object ( f.e. trigger )
Very simillar to event "collisionstop", but player should go in object and them go out from object, not just go away
*/
export interface ICameoutMapEvent extends IMapEvent {
    name: "cameout",
    side: Side;
}