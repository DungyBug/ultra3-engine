import OrthogonalCamera from "../../../cameras/orthogonal-camera";
import PerspectiveCamera from "../../../cameras/perspective-camera";

export default interface IOpenGLRendererOptions {
    canvas?: HTMLCanvasElement;
    width?: number;
    height?: number;
    camera?: PerspectiveCamera | OrthogonalCamera;
}