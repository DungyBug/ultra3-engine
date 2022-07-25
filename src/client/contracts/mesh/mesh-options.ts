import { IVector } from "../../../core/contracts/base/vector";
import IVector2D from "../../../core/contracts/base/vector2d";
import BaseMaterial from "../../base-material";
import VerticesMode from "../../constants/verticies-mode";
import IBaseMeshOptions from "./base-mesh-opts";

export default interface IMeshOptions extends IBaseMeshOptions {
    normals?: Array<IVector>;
    uvs?: Array<IVector>;
    indices?: Array<number>;
    material?: BaseMaterial;
    verticesMode?: VerticesMode;
}