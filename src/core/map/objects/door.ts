import { DoorState } from "../../constants/door-state/door-state";
import { IVector } from "../../contracts/base/vector";
import { IEntity } from "../../contracts/entity";
import { IMapEvent } from "../../contracts/map-event";
import { IMapObjectState } from "../../contracts/map-object";
import {
    IDoor,
    IDoorProps,
    IDoorState,
} from "../../contracts/map-objects/door";
import { MapObject } from "../../map-object";
import { World } from "../../world";

export class Door extends MapObject implements IDoor {
    protected nextthink: number;
    protected prevthink: number;
    protected direction: IVector;
    protected delay: number;
    protected speed: number;
    protected distance: number;
    protected openOn: Array<string>; // Names of events
    protected closeOn: Array<string>; // Names of events
    protected state: DoorState;
    protected origin: IVector;

    constructor(shape: string, props: IDoorProps, world: World) {
        super(null, props, world);
        this.direction = props.direction;
        this.delay = props.delay || 30000;
        this.distance = props.distance;
        this.openOn = props.openOn || [];
        this.closeOn = props.closeOn || [];
        this.origin = props.pos;
        this.nextthink = world.getTime();
        this.state = DoorState.idling;
    }

    open(by: IEntity) {
        let time = this.world.getTime();

        this.prevthink = time;
        this.state = DoorState.opening;

        this.nextthink = time + Math.round(this.distance / this.speed);
    }

    close(by: IEntity) {
        let time = this.world.getTime();

        this.prevthink = time;
        this.state = DoorState.closing;

        this.nextthink = time + Math.round(this.distance / this.speed);
    }

    think() {
        let time = this.world.getTime();

        switch (this.state) {
            case DoorState.opening: {
                // Set position for current time
                let coff =
                    (time - this.prevthink) / (this.nextthink - this.prevthink);

                this.props.pos.x =
                    this.origin.x + this.direction.x * this.speed * coff;
                this.props.pos.y =
                    this.origin.y + this.direction.y * this.speed * coff;
                this.props.pos.z =
                    this.origin.z + this.direction.z * this.speed * coff;

                // Check if door finished opening
                if (this.nextthink >= time) {
                    this.state = DoorState.waiting;

                    // Check if we should close after some time
                    if (this.delay) {
                        this.nextthink = time + this.delay;
                    }
                }

                break;
            }
            case DoorState.waiting: {
                // Check for closing delay

                if (this.nextthink >= time && this.delay) {
                    this.close(null);
                }

                break;
            }
            case DoorState.closing: {
                // Set position for current time
                let coff =
                    (time - this.prevthink) / (this.nextthink - this.prevthink);

                this.props.pos.x =
                    this.origin.x + this.direction.x * this.speed * coff;
                this.props.pos.y =
                    this.origin.y + this.direction.y * this.speed * coff;
                this.props.pos.z =
                    this.origin.z + this.direction.z * this.speed * coff;

                // Check if door finished closing
                if (this.nextthink >= time) {
                    this.state = DoorState.idling;
                }

                break;
            }
        }
    }

    setMapObjectState(state: IDoorState): void {
        super.setMapObjectState(state);

        this.delay = state.props.delay || this.delay;
        this.speed = state.props.speed;
        this.distance = state.props.distance;
        this.direction = state.props.direction;
        this.openOn = state.props.openOn || this.openOn;
        this.closeOn = state.props.closeOn || this.closeOn;
    }

    getMapObjectState(): IDoorState {
        const parentState = super.getMapObjectState();
        return {
            ...parentState,
            props: {
                ...parentState.props,
                delay: this.delay,
                speed: this.speed,
                distance: this.distance,
                direction: this.direction,
                openOn: this.openOn,
                closeOn: this.closeOn,
            },
            nextthink: this.nextthink,
            prevthink: this.prevthink,
            state: this.state,
            origin: this.origin,
        };
    }

    emit(event: string, e: IMapEvent): Array<boolean> {
        super.emit(event, e);

        if (this.openOn.includes(event)) {
            // Check for opening event
            this.open(e.activators[0]);
        } else if (this.closeOn.includes(event)) {
            this.close(e.activators[0]);
        }

        return [true];
    }
}
