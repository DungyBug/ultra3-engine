import { IMapObjectProps } from "../../contracts/map-object";
import { IBaseTrain } from "../../contracts/map-objects/train";
import { ITrainEnd } from "../../contracts/map-objects/train-end";
import { ITrainNode } from "../../contracts/map-objects/train-node";
import {
    ITrainStart,
    ITrainStartState,
} from "../../contracts/map-objects/train-start";
import { World } from "../../world";
import { BaseTrain } from "./train";
import { TrainEnd } from "./train-end";
import { TrainNode } from "./train-node";

export class TrainStart extends BaseTrain implements ITrainStart {
    readonly end: true;
    protected _next: ITrainNode | ITrainEnd;

    constructor(props: IMapObjectProps, world: World) {
        super(
            {
                ...props,
                end: true,
            },
            world
        );
    }

    next() {
        return this._next;
    }

    setNext(train: ITrainNode | ITrainEnd) {
        this._next = train;
    }

    getNodesList() {
        let nodes: Array<IBaseTrain> = [this._next];

        while (nodes[nodes.length - 1].end === false) {
            nodes.push((nodes[nodes.length - 1] as ITrainNode).next());
        }

        return nodes;
    }

    getPos() {
        return this.props.pos;
    }

    getMapObjectState(): ITrainStartState {
        const parentState = super.getMapObjectState();

        return {
            ...parentState,
            next: this._next.id,
        };
    }

    setMapObjectState(state: ITrainStartState): void {
        super.setMapObjectState(state);

        const train = this.world.getObject(state.next);

        if (train instanceof TrainNode || train instanceof TrainEnd) {
            this._next = train;
        }
    }
}
