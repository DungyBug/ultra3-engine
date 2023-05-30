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
    readonly end: true = true;
    protected _next: ITrainNode | ITrainEnd | null = null;

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
        if(this._next === null) {
            throw new Error("Next train is not specified.");
        }

        let nodes: Array<IBaseTrain> = [this._next];

        while (true) {
            const lastNode = nodes[nodes.length - 1];

            if(lastNode === undefined) {
                break;
            }

            if(lastNode.end) {
                break;
            }

            const nextNode = (nodes[nodes.length - 1] as ITrainNode).next();

            if(nextNode === null) {
                break;
            }

            nodes.push(nextNode);
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
            next: this._next?.id ?? -1,
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
