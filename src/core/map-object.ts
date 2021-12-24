import { IMapEvent } from "./contracts/map-event";
import { IMapObject, IMapObjectProps } from "./contracts/map-object";
import { World } from "./world";
import { EventEmitter } from "./services/event-emitter";

export class MapObject extends EventEmitter implements IMapObject {
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
        world.addObject(this);
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
        if(!this.targets.includes(object)) { // Check if we already connected to object
            this.targets.push(object);
        }
    }

    on(event: string, callback: (e: IMapEvent) => boolean) {
        super.on(event, callback);
    }

    emit(event: string, e: IMapEvent): Array<boolean> { // All callbacks returns boolean ( whether event need to be counted, f.e. if you try to open door, door can block this attempt, 'cause callback returned false )
        let result = super.emit(event, e);
        return result;
    }

    think() {
        // Do nothing
    }
}