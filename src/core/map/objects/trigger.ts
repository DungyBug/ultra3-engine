import { IEntity } from "../contracts/entity";
import { IMapEvent } from "../contracts/map-event";
import { ITriggerEvent } from "../contracts/map-events/trigger";
import { ITrigger } from "../contracts/map-objects/trigger";
import { MapObject } from "../map-object";

export class Trigger extends MapObject implements ITrigger {
    trigger(by: IEntity) {
        for(let i = 0; i < this.targets.length; i++) {
            this.targets[i].activate();
            this.targets[i].emit("trigger", {
                type: "trigger",
                activators: [by],
                triggerEvent: {
                    type: "activation",
                    activators: [by]
                }
            } as ITriggerEvent);
        }
    }

    emit(event: string, e: IMapEvent): Array<boolean> {
        let result = super.emit(event, e);

        // Send events to connected objects
        for(let i = 0; i < this.targets.length; i++) {
            this.targets[i].activate();
            this.targets[i].emit("trigger", {
                type: "trigger",
                activators: e.activators,
                triggerEvent: e
            } as ITriggerEvent);
        }

        return result;
    }
}