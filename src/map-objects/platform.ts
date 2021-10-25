import { PlatformDirection } from "../constants/platform-direction";
import { PlatformState } from "../constants/platform-state/platform-state";
import { IVector } from "../contracts/base/vector";
import { IEntity } from "../contracts/entity";
import { IPlatform, IPlatformProps } from "../contracts/map-objects/platform";
import { IBaseTrain } from "../contracts/map-objects/train";
import { ITrainStart } from "../contracts/map-objects/train-start";
import { MapObject } from "../map-object";
import { VectorMath } from "../vector-math";
import { World } from "../world";

export class Platform extends MapObject implements IPlatform {
    protected nextthink: number;
    protected prevthink: number;
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

    constructor(shape: string, props: IPlatformProps, world: World) {
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

    startMoving(by: IEntity) {
        this.state = PlatformState.moving;
        this.prevthink = this.world.getTime();
    }

    stopMoving(by: IEntity) {
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

        switch(this.state) {
            case PlatformState.moving: {
                let trainIndex = Math.floor(this.currentPathPos);
                let currentTrain: IBaseTrain;
                let nextTrain: IBaseTrain;
                
                let nodes = this.train.getNodesList();
                let speed: number;

                if(trainIndex < nodes.length && this.direction === PlatformDirection.forward) { // Check for path end
                    // Move forward

                    currentTrain = nodes[trainIndex];
                    nextTrain = nodes[trainIndex + 1];
                    speed = this.speeds[Math.min(trainIndex, this.speeds.length - 1)]; // Get speed for current train or take last available speed
                } else if (trainIndex >= 0 && this.direction === PlatformDirection.backward) { // Check for path end
                    // Move backward
                    
                    currentTrain = nodes[trainIndex];
                    nextTrain = nodes[trainIndex - 1];
                    speed = this.speeds[Math.min(trainIndex, this.speeds.length - 1)]; // Get speed for current train or take last available speed
                } else {
                    break;
                }
                let travelTime = VectorMath.getLength(VectorMath.subtract(nextTrain.getPos(), currentTrain.getPos())) / speed;
                let deltaTime = (time - this.prevthink) * 0.001;

                let direction: IVector = VectorMath.subdivide(
                    VectorMath.subtract(nextTrain.getPos(), currentTrain.getPos()),
                    travelTime // Get already magnituted vector
                );

                this.props.pos.x += direction.x * deltaTime;
                this.props.pos.y += direction.y * deltaTime;
                this.props.pos.z += direction.z * deltaTime;

                if(Math.floor(this.currentPathPos) !== Math.floor(this.currentPathPos + travelTime * deltaTime)) {
                    if(this.currentPathPos <= 0) { // Check if we come to start point
                        this.currentPathPos = 0;
                        this.stopMoving(null);
                        
                        this.direction = PlatformDirection.forward;
                    }
                    
                    if(this.currentPathPos >= nodes.length) { // Check if we come to end point
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
}