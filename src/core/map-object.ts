import { IMapEvent } from "./contracts/map-event";
import {
    IMapObject,
    IMapObjectProps,
    IMapObjectState,
} from "./contracts/map-object";
import { World } from "./world";
import { EventEmitter } from "./services/event-emitter";

export class MapObject extends EventEmitter implements IMapObject {
    id: number;
    protected shape: string; // IShape
    protected props: IMapObjectProps;
    protected state: number;
    protected world: World;
    protected targets: Array<IMapObject>;

    constructor(shape: string, props: IMapObjectProps, world: World) {
        super();
        this.shape = shape;
        this.props = props;
        this.world = world;
        this.state = 0;
        this.id = world.addObject(this);
    }

    activate() {
        // Do nothing
    }

    getProps() {
        return this.props;
    }

    getState() {
        return this.state;
    }

    getShape() {
        return this.shape;
    }

    connect(object: IMapObject) {
        if (!this.targets.includes(object)) {
            // Check if we already connected to object
            this.targets.push(object);
        }
    }

    on(event: string, callback: (e: IMapEvent) => boolean) {
        super.on(event, callback);
    }

    emit(event: string, e: IMapEvent): Array<boolean> {
        // All callbacks returns boolean ( whether event need to be counted, f.e. if you try to open door, door can block this attempt, 'cause callback returned false )
        let result = super.emit(event, e);
        return result;
    }

    setMapObjectState(state: IMapObjectState): void {
        this.props.rotation = state.props.rotation;
        this.props.pos = state.props.pos;
        this.props.scale = state.props.scale;

        // Set targets
        this.targets = [];
        for (const targetId of state.targets) {
            this.targets.push(this.world.getObject(targetId));
        }

        this.state = state.state;
    }

    getMapObjectState(): IMapObjectState {
        const targetIds: Array<number> = [];

        for (const target of this.targets) {
            targetIds.push(target.id);
        }

        return {
            id: this.id,
            props: {
                name: this.props.name,
                rotation: this.props.rotation,
                pos: this.props.pos,
                scale: this.props.scale,
            },
            state: this.state,
            targets: targetIds,
        };
    }

    think() {
        // Do nothing
    }
}
