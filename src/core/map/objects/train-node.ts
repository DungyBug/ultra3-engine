import { IMapObjectProps } from "../../contracts/map-object";
import { ITrainEnd } from "../../contracts/map-objects/train-end";
import {
    ITrainNode,
    ITrainNodeState,
} from "../../contracts/map-objects/train-node";
import { ITrainStart } from "../../contracts/map-objects/train-start";
import { World } from "../../world";
import { BaseTrain } from "./train";
import { TrainEnd } from "./train-end";
import { TrainStart } from "./train-start";

export class TrainNode extends BaseTrain implements ITrainNode {
    readonly end: false;
    protected _next: ITrainNode | ITrainEnd;
    protected _prev: ITrainStart | ITrainNode;

    constructor(props: IMapObjectProps, world: World) {
        super(
            {
                ...props,
                end: false,
            },
            world
        );
    }

    next() {
        return this._next;
    }

    prev() {
        return this._prev;
    }

    setNext(train: ITrainNode | ITrainEnd) {
        this._next = train;
    }

    setPrev(train: ITrainStart | ITrainNode) {
        this._prev = train;
    }

    getPos() {
        return this.props.pos;
    }

    getMapObjectState(): ITrainNodeState {
        const parentState = super.getMapObjectState();

        return {
            ...parentState,
            prev: this._prev.id,
            next: this._next.id,
        };
    }

    setMapObjectState(state: ITrainNodeState): void {
        super.setMapObjectState(state);

        const nextTrain = this.world.getObject(state.next);
        const prevTrain = this.world.getObject(state.prev);

        if (nextTrain instanceof TrainNode || nextTrain instanceof TrainEnd) {
            this._next = nextTrain;
        }

        if (prevTrain instanceof TrainNode || prevTrain instanceof TrainStart) {
            this._prev = prevTrain;
        }
    }
}
