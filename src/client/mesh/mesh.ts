import { IVector } from "../../core/contracts/base/vector";
import IVector2D from "../../core/contracts/base/vector2d";
import Vector from "../../core/lib/vector";
import BaseMaterial from "../base-material";
import VerticesMode from "../constants/verticies-mode";
import IMesh from "../contracts/mesh";
import IMeshOptions from "../contracts/mesh/mesh-options";
import BaseMesh from "./base-mesh";

class Mesh extends BaseMesh implements IMesh {
    public material: BaseMaterial;
    public verticesMode: VerticesMode;
    protected _vertices: Array<IVector>;
    protected _indices: Array<number>;
    protected _normals: Array<IVector>;
    protected _uvs: Array<IVector2D>;

    constructor(params: IMeshOptions) {
        super(params);
        this._normals = params.normals || this.vertices.map(() => new Vector(0, 0, 0));
        this._uvs = params.uvs || this.vertices.map(() => new Vector(0, 0, 0));
        this._indices = params.indices || this.vertices.map((v, i) => i);
        this.material = params.material;
        this.verticesMode = params.verticesMode || VerticesMode.TRIANGLES;
    }

    setMaterial(material: BaseMaterial) {
        this.material = material;
    }

    setVertices(vertices: Array<IVector>) {
        this._vertices = vertices;
        this._indices = this.vertices.map((v, i) => i);
    }

    setIndices(indices: Array<number>) {
        this._indices = indices;
    }

    setNormals(normals: Array<IVector>) {
        this._normals = normals;
    }

    setUVs(uvs: Array<IVector>) {
        this._uvs = uvs;
    }

    get vertices(): IVector[] {
        return this._vertices;
    }

    get indices(): number[] {
        return this._indices;
    }

    get normals(): IVector[] {
        return this._normals;
    }

    get uvs(): IVector2D[] {
        return this._uvs;
    }
}

export default Mesh;