import { IMapEvent } from "./contracts/map-event";
import { IMapObject, IMapObjectProps } from "./contracts/map-object";
import { World } from "./world";
import { EventEmitter } from "./common/event-emitter";

export class MapObject extends EventEmitter implements IMapObject {
    protected shape: string; // IShape
    protected props: IMapObjectProps;
    protected state: number;
    protected world: World;

    constructor(shape: string, props: IMapObjectProps, world: World) {
        super();
        this.shape = shape;
        this.props = props;
        this.world = world;
        this.state = 0;
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

    connect(name: string) {
        if(!this.props.targets.includes(name)) {
            this.props.targets.push(name);
        }
    }

    on(event: string, callback: (e: IMapEvent) => boolean) {
        super.on(event, callback);
    }

    emit(event: string, e: IMapEvent): Array<boolean> {
        let result = super.emit(event, e);
        return result;
    }

    think() {
        // Do nothing
    }
}