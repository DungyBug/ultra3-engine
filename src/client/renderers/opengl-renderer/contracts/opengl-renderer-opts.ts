import BaseCamera from "../../../camera";

export default interface IOpenGLRendererOptions {
    canvas?: HTMLCanvasElement;
    width?: number;
    height?: number;
    camera?: BaseCamera;
}