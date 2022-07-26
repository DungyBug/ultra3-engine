import WorldEvents from "../../core/contracts/world-events";
import ClientMapObject from "../map/client-object";
import Mesh from "../mesh/mesh";

type ClientWorldEvents = {
    start: [];
    clientmapobject: [ClientMapObject];
    meshRegistered: [Mesh];
    meshFreeRequest: [Mesh];
} & WorldEvents;

export default ClientWorldEvents;