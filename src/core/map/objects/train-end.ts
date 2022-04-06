import { IMapObjectProps } from "../../contracts/map-object";
import { IBaseTrain } from "../../contracts/map-objects/train";
import {
    ITrainEnd,
    ITrainEndState,
} from "../../contracts/map-objects/train-end";
import { ITrainNode } from "../../contracts/map-objects/train-node";
import { ITrainStart } from "../../contracts/map-objects/train-start";
import { World } from "../../world";
import { BaseTrain } from "./train";
import { TrainNode } from "./train-node";
import { TrainStart } from "./train-start";

export class TrainEnd extends BaseTrain implements ITrainEnd {
    readonly end: true;
    protected _prev: ITrainStart | ITrainNode;

    constructor(props: IMapObjectProps, world: World) {
        super(
            {
                ...props,
                end: true,
            },
            world
        );
    }

    prev() {
        return this._prev;
    }

    setPrev(train: ITrainStart | ITrainNode) {
        this._prev = train;
    }

    getNodesList() {
        let nodes: Array<IBaseTrain> = [this._prev];

        while (nodes[nodes.length - 1].end === false) {
            nodes.push((nodes[nodes.length - 1] as ITrainNode).prev());
        }

        return nodes;
    }

    getPos() {
        return this.props.pos;
    }

    getMapObjectState(): ITrainEndState {
        const parentState = super.getMapObjectState();

        return {
            ...parentState,
            prev: this._prev.id,
        };
    }

    setMapObjectState(state: ITrainEndState): void {
        super.setMapObjectState(state);

        const train = this.world.getObject(state.prev);

        if (train instanceof TrainStart || train instanceof TrainNode) {
            this._prev = train;
        }
    }
}
