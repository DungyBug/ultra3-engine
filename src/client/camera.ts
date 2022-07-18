import { IVector } from "../core/contracts/base/vector";
import Vector from "../core/lib/vector";
import IBaseCamera from "./contracts/camera";

class BaseCamera implements IBaseCamera {
    public position: Vector;
    public rotation: Vector;
    public fov: number;
    public zNear: number;
    public zFar: number;

    constructor(props: Partial<IBaseCamera> = {}) {
        this.position = Vector.from(props.position || {x: 0, y: 0, z: 0});
        this.rotation = Vector.from(props.rotation || {x: 0, y: 0, z: 0});
        this.fov = props.fov || Math.PI / 2;
        this.zNear = props.zNear || 0.1;
        this.zFar = props.zFar || 100.0;
    }

    lookAt(pos: IVector): void {
        const direction = Vector.normalize(Vector.add(pos, this.position));

        this.rotation.y = Math.atan2(direction.z, direction.x) + Math.PI / 2;
        this.rotation.x = Math.atan2(Math.hypot(direction.x, direction.z), direction.y) - Math.PI / 2;
    }
}

export default BaseCamera;