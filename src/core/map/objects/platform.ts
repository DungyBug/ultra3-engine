import { PlatformDirection } from "../../constants/platform-direction";
import { PlatformState } from "../../constants/platform-state/platform-state";
import { IVector } from "../../contracts/base/vector";
import { IEntity } from "../../contracts/entity";
import {
    IPlatform,
    IPlatformProps,
    IPlatformState,
} from "../../contracts/map-objects/platform";
import { IBaseTrain } from "../../contracts/map-objects/train";
import { ITrainStart } from "../../contracts/map-objects/train-start";
import IPhysicalMesh from "../../contracts/physical-mesh";
import Vector from "../../lib/vector";
import { MapObject } from "../../map-object";
import { World } from "../../world";
import { TrainStart } from "./train-start";

export class Platform extends MapObject implements IPlatform {
    protected nextthink: number = 0;
    protected prevthink: number = 0;
    protected currentPathPos: number; // Current position on path ( coefficient ) and current train node
    protected train: ITrainStart;
    /**
     * speeds
     * Array of speeds for separate train nodes
     * Note: if train count is bigger than speeds count, then will be used last speed in array
     */
    protected speeds: Array<number>;
    protected state: PlatformState;
    protected origin: IVector;
    protected direction: PlatformDirection;

    constructor(shape: IPhysicalMesh, props: IPlatformProps, world: World) {
        super(shape, props, world);
        this.train = props.train;
        this.speeds = [props.speed];
        this.state = PlatformState.idling;
        this.direction = PlatformDirection.forward;
        this.currentPathPos = 0;
        this.origin = props.pos;
    }

    setTrain(train: ITrainStart) {
        this.train = train;
    }

    startMoving(by: IEntity | null) {
        this.state = PlatformState.moving;
        this.prevthink = this.world.getTime();
    }

    stopMoving(by: IEntity | null) {
        this.state = PlatformState.idling;
    }

    setPathSpeeds(speeds: Array<number>) {
        // Maybe, i will add check for size of speeds array to prevent empty arrays
        // but there is no much sense: will you pass empty array of speeds?
        // This is like foolproof: it's useful in some cases, but not very much
        this.speeds = speeds;
    }

    think() {
        let time = this.world.getTime();

        switch (this.state) {
            case PlatformState.moving: {
                let trainIndex = Math.floor(this.currentPathPos);
                let currentTrain: IBaseTrain;
                let nextTrain: IBaseTrain;

                let nodes = this.train.getNodesList();
                let speed: number;

                if (
                    trainIndex < nodes.length &&
                    this.direction === PlatformDirection.forward
                ) {
                    // Check for path end
                    // Move forward

                    // shut up error this way
                    const currentNode = nodes[trainIndex];
                    const nextNode = nodes[trainIndex + 1] ?? currentNode;

                    if(!currentNode || !nextNode) {
                        return;
                    }

                    currentTrain = currentNode;
                    nextTrain = nextNode;

                    speed =
                        this.speeds[
                            Math.min(trainIndex, this.speeds.length - 1)
                        ] ?? 0; // Get speed for current train or take last available speed
                } else if (
                    trainIndex >= 0 &&
                    this.direction === PlatformDirection.backward
                ) {
                    // Check for path end
                    // Move backward

                    // shut up error this way
                    const currentNode = nodes[trainIndex];
                    const nextNode = nodes[trainIndex + 1] ?? currentNode;

                    if(!currentNode || !nextNode) {
                        return;
                    }

                    currentTrain = currentNode;
                    nextTrain = nextNode;
                    speed =
                        this.speeds[
                            Math.min(trainIndex, this.speeds.length - 1)
                        ] ?? 0; // Get speed for current train or take last available speed
                } else {
                    break;
                }

                let travelTime =
                    Vector.magnitude(
                        Vector.sub(
                            nextTrain.getPos(),
                            currentTrain.getPos()
                        )
                    ) / speed;

                let deltaTime = (time - this.prevthink) * 0.001;

                let direction: Vector = Vector.div(
                    Vector.sub(
                        nextTrain.getPos(),
                        currentTrain.getPos()
                    ),
                    new Vector(travelTime) // Get already magnituted vector
                );

                this.props.pos.x += direction.x * deltaTime;
                this.props.pos.y += direction.y * deltaTime;
                this.props.pos.z += direction.z * deltaTime;

                if (
                    Math.floor(this.currentPathPos) !==
                    Math.floor(this.currentPathPos + travelTime * deltaTime)
                ) {
                    if (this.currentPathPos <= 0) {
                        // Check if we'd come to start point
                        this.currentPathPos = 0;
                        this.stopMoving(null);

                        this.direction = PlatformDirection.forward;
                    }

                    if (this.currentPathPos >= nodes.length) {
                        // Check if we'd come to end point
                        this.currentPathPos = nodes.length;
                        this.stopMoving(null);

                        this.direction = PlatformDirection.backward;
                    }
                }

                this.currentPathPos += travelTime * deltaTime;
                break;
            }
        }

        this.prevthink = time;
    }

    setMapObjectState(state: IPlatformState): void {
        super.setMapObjectState(state);

        this.speeds = state.speeds;
        const train = this.world.getObject(state.props.train);

        if (train instanceof TrainStart) {
            this.train = train;
        } else {
            throw new Error("Train is not instance of TrainStart. Make sure that provided trainID refers to an existing TrainStart object and this TrainStart object hasn't been deleted.");
        }

        this.prevthink = state.prevthink;
        this.nextthink = state.nextthink;
        this.currentPathPos = state.currentPathPos;
        this.speeds = state.speeds;
        this.origin = state.origin;
        this.direction = state.direction;
    }

    getMapObjectState(): IPlatformState {
        const parentState = super.getMapObjectState();

        return {
            ...parentState,
            props: {
                ...parentState.props,
                speed: this.speeds[0] ?? 0,
                train: this.train.id,
            },
            prevthink: this.prevthink,
            nextthink: this.nextthink,
            currentPathPos: this.currentPathPos,
            speeds: this.speeds,
            origin: this.origin,
            direction: this.direction,
        };
    }
}
