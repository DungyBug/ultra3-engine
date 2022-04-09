import { IVector } from "../../../core/contracts/base/vector";
import DrawMode from "../../constants/draw-mode";
import IMaterial from "../material";

interface IBaseMeshOptions {
    pos: IVector;
    scale: IVector;
    rotation: IVector;
    drawMode?: DrawMode; // DYNAMIC by default
    vertices: Array<IVector>;
}

export default IBaseMeshOptions;
