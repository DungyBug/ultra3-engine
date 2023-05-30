import Vector from "../../core/lib/vector";
import { IPerspectiveCamera } from "../contracts/cameras/camera";
import BaseCamera from "./base-camera";

class PerspectiveCamera extends BaseCamera implements IPerspectiveCamera {
    public type: "perspective";
    public fov: number;
    public zNear: number;
    public zFar: number;

    constructor(props: Partial<IPerspectiveCamera> = {}) {
        super(props);
        this.type = "perspective";
        this.fov = props.fov || Math.PI / 2;

        this.zNear = 0.1;
        this.zFar = 100;
    }
}

export default PerspectiveCamera;