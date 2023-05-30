import { MapObject } from "../../core/map-object";
import ClientWorld from "../client-world";
import IMesh from "../contracts/mesh";

export default class ClientMapObject<T extends MapObject = MapObject> {
    public object: T;
    public mesh: IMesh;

    constructor(object: T, mesh: IMesh, world: ClientWorld | null = null) {
        this.object = object;
        this.mesh = mesh;

        if(world) {
            world.addClientMapObject(this);
        }
    }
}