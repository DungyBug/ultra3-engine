import { IVector } from "../../../core/contracts/base/vector";
import DrawMode from "../../constants/draw-mode";

interface IBaseMeshOptions {
    pos?: IVector; // 0, 0, 0 by default
    scale?: IVector; // 1, 1, 1 by default
    rotation?: IVector; // 0, 0, 0 by default
    drawMode?: DrawMode; // DYNAMIC by default
    vertices?: Array<IVector>; // [] by default
    visible?: boolean;
}

export default IBaseMeshOptions;
