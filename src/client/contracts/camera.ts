import { IVector } from "../../core/contracts/base/vector";

interface IBaseCamera {
    position: IVector;
    rotation: IVector;
    fov: number;
    zNear: number;
    zFar: number;
}

export default IBaseCamera;