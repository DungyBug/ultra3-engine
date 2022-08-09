import { IVector } from "../../core/contracts/base/vector";
import DrawMode from "../constants/draw-mode";

interface IBaseMesh {
    pos: IVector;
    scale: IVector;
    rotation: IVector;
    drawMode: DrawMode;
    visible: boolean;
}

export default IBaseMesh;
