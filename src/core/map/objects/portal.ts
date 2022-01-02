import { IPortal } from "../../contracts/map-objects/portal";
import { MapObject } from "../../map-object";

class Portal extends MapObject implements IPortal {
    protected _connection: IPortal = null;

    connectTo(portal: IPortal) {
        this._connection = portal;
    }

    get connection(): IPortal {
        return this._connection;
    }
}

export default Portal;