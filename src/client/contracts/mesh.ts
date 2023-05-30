import { IVector } from "../../core/contracts/base/vector";
import IVector2D from "../../core/contracts/base/vector2d";
import VerticesMode from "../constants/verticies-mode";
import IBaseMesh from "./base-mesh";
import IMaterial from "./material";

interface IMesh extends IBaseMesh {
    verticesMode: VerticesMode;

    get vertices(): Array<IVector>;
    get verticesFlatArray(): Float32Array;
    get indices(): Array<number>;
    get id(): number;
    get normals(): Array<IVector>;
    get normalsFlatArray(): Float32Array;
    get uvs(): Array<IVector>;
    get uvsFlatArray(): Float32Array;

    get material(): IMaterial | null;
}

export default IMesh;
