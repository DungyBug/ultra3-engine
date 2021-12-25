import { IMapObjectProps } from "../../contracts/map-object";
import { IBaseTrain } from "../../contracts/map-objects/train";
import { ITrainEnd } from "../../contracts/map-objects/train-end";
import { ITrainNode } from "../../contracts/map-objects/train-node";
import { ITrainStart } from "../../contracts/map-objects/train-start";
import { World } from "../../world";
import { BaseTrain } from "./train";

export class TrainStart extends BaseTrain implements ITrainStart {
    readonly end: true;
    protected _next: ITrainNode | ITrainEnd;

    constructor(props: IMapObjectProps, world: World) {
        super({
            ...props,
            end: true
        }, world);
    }

    next() {
        return this._next;
    }

    setNext(train: ITrainNode | ITrainEnd) {
        this._next = train;
    }

    getNodesList() {
        let nodes: Array<IBaseTrain> = [this._next];

        while(nodes[nodes.length - 1].end === false) {
            nodes.push((nodes[nodes.length - 1] as ITrainNode).next());
        }

        return nodes;
    }

    getPos() {
        return this.props.pos;
    }
}