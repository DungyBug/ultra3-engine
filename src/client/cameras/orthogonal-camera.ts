import Vector from "../../core/lib/vector";
import { IOrthogonalCamera } from "../contracts/cameras/camera";
import BaseCamera from "./base-camera";

class OrthogonalCamera extends BaseCamera implements IOrthogonalCamera {
    public type: "orthogonal";
    public position: Vector;
    public rotation: Vector;
    public scale: number;
    public zNear: number;
    public zFar: number;

    constructor(props: Partial<IOrthogonalCamera> = {}) {
        super(props);
        this.type = "orthogonal";
        this.scale = props.scale || 1;
    }
}

export default OrthogonalCamera;