import { IVector } from "../../core/contracts/base/vector";
import IVector2D from "../../core/contracts/base/vector2d";
import VerticesMode from "../constants/verticies-mode";
import IBaseMesh from "./base-mesh";

interface IMesh extends IBaseMesh {
    castsShadow: boolean;
    verticesMode: VerticesMode;
    
    get vertices(): Array<IVector>;
    get indices(): Array<number>;
    get normals(): Array<IVector>;
    get uvs(): Array<IVector2D>;
}

export default IMesh;