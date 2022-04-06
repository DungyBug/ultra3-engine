import { IPortal, IPortalState } from "../../contracts/map-objects/portal";
import { MapObject } from "../../map-object";

class Portal extends MapObject implements IPortal {
    protected _connection: IPortal = null;

    connectTo(portal: IPortal) {
        this._connection = portal;
    }

    get connection(): IPortal {
        return this._connection;
    }

    getMapObjectState(): IPortalState {
        const parentState = super.getMapObjectState();

        if (this._connection === null) {
            return {
                ...parentState,
                connection: -1,
            };
        }

        return {
            ...parentState,
            connection: this._connection.id,
        };
    }

    setMapObjectState(state: IPortalState): void {
        super.setMapObjectState(state);

        if (state.connection === -1) {
            this._connection = null;
        } else {
            const entity = this.world.getObject(state.connection);

            if (entity instanceof Portal) {
                this._connection = entity;
            } else {
                this._connection = null;
            }
        }
    }
}

export default Portal;
