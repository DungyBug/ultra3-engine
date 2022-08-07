import { IVector } from "../../../core/contracts/base/vector";

interface IBaseCamera {
    type: "perspective" | "orthogonal";
    position: IVector;
    rotation: IVector;
    zNear: number;
    zFar: number;
}

interface IPerspectiveCamera extends IBaseCamera {
    type: "perspective";
    fov: number;
}

interface IOrthogonalCamera extends IBaseCamera {
    type: "orthogonal";
    scale: number;
}

type Camera = IPerspectiveCamera | IOrthogonalCamera;

export {IBaseCamera, IPerspectiveCamera, IOrthogonalCamera, Camera};