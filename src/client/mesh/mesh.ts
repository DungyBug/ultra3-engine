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
    protected _uvs: Array<IVector>;
    protected _verticesFlatArray: Float32Array;
    protected _normalsFlatArray: Float32Array;
    protected _uvsFlatArray: Float32Array;

    constructor(params: IMeshOptions) {
        super(params);
        this._normals = params.normals || this._vertices.map(() => new Vector(0, 0, 0));
        this._uvs = params.uvs || this._vertices.map(() => new Vector(0, 0, 0));
        this.indices = params.indices || this._vertices.map((v, i) => i);
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

    setUVs(uv: Array<IVector>) {
        this._uvs = uv;
    }

    get vertices(): IVector[] {
        return this._vertices;
    }

    get verticesFlatArray(): Float32Array {
        return this._verticesFlatArray;
    }

    get indices(): number[] {
        return this._indices;
    }

    get normals(): IVector[] {
        return this._normals;
    }

    get normalsFlatArray(): Float32Array {
        return this._normalsFlatArray;
    }

    get uvs(): IVector[] {
        return this._uvs;
    }

    get uvsFlatArray(): Float32Array {
        return this._uvsFlatArray;
    }

    set vertices(v: IVector[]) {
        this._verticesFlatArray = new Float32Array(this._indices.length * 3);
        
        for(let i = 0; i < this._indices.length; i++) {
            this._verticesFlatArray[i * 3] = v[this._indices[i]].x;
            this._verticesFlatArray[i * 3 + 1] = v[this._indices[i]].y;
            this._verticesFlatArray[i * 3 + 2] = v[this._indices[i]].z;
        }

        this._vertices = v;
    }

    set normals(n: IVector[]) {
        this._normalsFlatArray = new Float32Array(this._indices.length * 3);
        
        for(let i = 0; i < this._indices.length; i++) {
            this._normalsFlatArray[i * 3] = n[this._indices[i]].x;
            this._normalsFlatArray[i * 3 + 1] = n[this._indices[i]].y;
            this._normalsFlatArray[i * 3 + 2] = n[this._indices[i]].z;
        }

        this._normals = n;
    }

    set uvs(uv: IVector[]) {
        this._uvsFlatArray = new Float32Array(this._indices.length * 2);
        
        for(let i = 0; i < this._indices.length; i++) {
            this._uvsFlatArray[i * 2] = uv[this._indices[i]].x;
            this._uvsFlatArray[i * 2 + 1] = uv[this._indices[i]].y;
        }

        this._uvs = uv;
    }

    set indices(is: number[]) {
        this._indices = is;
        this.normals = this._normals;
        this.uvs = this._uvs;
        this.vertices = this._vertices;
    }
}

export default Mesh;