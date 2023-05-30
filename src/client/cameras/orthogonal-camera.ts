import Vector from "../../core/lib/vector";
import { IOrthogonalCamera } from "../contracts/cameras/camera";
import BaseCamera from "./base-camera";

class OrthogonalCamera extends BaseCamera implements IOrthogonalCamera {
    public type: "orthogonal";
    public scale: number;
    public zNear: number;
    public zFar: number;

    constructor(props: Partial<IOrthogonalCamera> = {}) {
        super(props);
        this.type = "orthogonal";
        this.scale = props.scale || 1;

        this.zNear = 0.1;
        this.zFar = 100;
    }
}

export default OrthogonalCamera;