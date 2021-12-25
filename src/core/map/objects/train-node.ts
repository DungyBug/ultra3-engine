import { IMapObjectProps } from "../../contracts/map-object";
import { ITrainEnd } from "../../contracts/map-objects/train-end";
import { ITrainNode } from "../../contracts/map-objects/train-node";
import { ITrainStart } from "../../contracts/map-objects/train-start";
import { World } from "../../world";
import { BaseTrain } from "./train";

export class TrainNode extends BaseTrain implements ITrainNode {
    readonly end: false;
    protected _next: ITrainNode | ITrainEnd;
    protected _prev: ITrainStart | ITrainNode;

    constructor(props: IMapObjectProps, world: World) {
        super({
            ...props,
            end: false
        }, world);
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
}