import WorldEvents from "../../core/contracts/world-events";
import ClientMapObject from "../map/client-object";

type ClientWorldEvents = {
    start: [];
    clientmapobject: [ClientMapObject];
} & WorldEvents;

export default ClientWorldEvents;