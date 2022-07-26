import { IVector } from "../../core/contracts/base/vector";
import IVector2D from "../../core/contracts/base/vector2d";
import Vector from "../../core/lib/vector";
import BaseMaterial from "../base-material";
import ClientEngine from "../client-engine";
import VerticesMode from "../constants/verticies-mode";
import IMesh from "../contracts/mesh";
import IMeshOptions from "../contracts/mesh/mesh-options";
import BaseMesh from "./base-mesh";

class Mesh extends BaseMesh implements IMesh {
    public material: BaseMaterial;
    public verticesMode: VerticesMode;
    public id: number;
    protected _vertices: Array<IVector>;
    protected _indices: Array<number>;
    protected _normals: Array<IVector>;
    protected _uvs: Array<IVector>;
    protected _verticesFlatArray: Float32Array;
    protected _normalsFlatArray: Float32Array;
    protected _uvsFlatArray: Float32Array;
    protected _engine: ClientEngine | null;
    private _verticesUpdated: boolean;
    private _normalsUpdated: boolean;
    private _uvsUpdated: boolean;

    constructor(params: IMeshOptions, engine: ClientEngine | null = null) {
        super(params);
        this._normals = params.normals || this._vertices.map(() => new Vector(0, 0, 0));
        this._uvs = params.uvs || this._vertices.map(() => new Vector(0, 0, 0));
        this._indices = params.indices || this._vertices.map((v, i) => i);
        this.material = params.material;
        this.verticesMode = params.verticesMode || VerticesMode.TRIANGLES;
        this.id = -1;
        this._engine = engine;
        this._verticesUpdated = false;
        this._normalsUpdated = false;
        this._uvsUpdated = false;
        this.generateFlatArrays();

        if(engine !== null) {
            this.id = engine.registerMesh(this);
        }
    }

    /**
     * Deletes all bound to entity buffers, clears stuff
     */
    free() {
        if(this._engine === null) {
            return;
        }

        this._engine.freeMesh(this);
    }

    setMaterial(material: BaseMaterial) {
        this.material = material;
    }

    register(engine: ClientEngine) {
        this.id = engine.registerMesh(this);
        this._engine = engine;
    }

    setVertices(vertices: Array<IVector>) {
        this.vertices = vertices;
        this.indices = this.vertices.map((v, i) => i);
    }

    setIndices(indices: Array<number>) {
        this.indices = indices;
    }

    setNormals(normals: Array<IVector>) {
        this.normals = normals;
    }

    setUVs(uv: Array<IVector>) {
        this.uvs = uv;
    }

    /**
     * Emits "updated" event ( indicates that module or something else can update all buffers without wasting time for updating micro updates )
     * Updates all flat arrays
     */
    update() {
        if(this._verticesUpdated) {
            this._verticesFlatArray = new Float32Array(this._indices.length * 3);
        
            for(let i = 0; i < this._indices.length; i++) {
                this._verticesFlatArray[i * 3] = this._vertices[this._indices[i]].x;
                this._verticesFlatArray[i * 3 + 1] = this._vertices[this._indices[i]].y;
                this._verticesFlatArray[i * 3 + 2] = this._vertices[this._indices[i]].z;
            }

            this.emit("verticesUpdated");
        }

        if(this._normalsUpdated) {
            this._normalsFlatArray = new Float32Array(this._indices.length * 3);
        
            for(let i = 0; i < this._indices.length; i++) {
                this._normalsFlatArray[i * 3] = this._normals[this._indices[i]].x;
                this._normalsFlatArray[i * 3 + 1] = this._normals[this._indices[i]].y;
                this._normalsFlatArray[i * 3 + 2] = this._normals[this._indices[i]].z;
            }

            this.emit("normalsUpdated");
        }

        if(this._uvsUpdated) {
            this._uvsFlatArray = new Float32Array(this._indices.length * 2);
        
            for(let i = 0; i < this._indices.length; i++) {
                this._uvsFlatArray[i * 2] = this._uvs[this._indices[i]].x;
                this._uvsFlatArray[i * 2 + 1] = this._uvs[this._indices[i]].y;
            }

            this.emit("uvsUpdated");
        }

        if(this._verticesUpdated || this._normalsUpdated || this._uvsUpdated) {
            this.emit("updated");
        }

        this._verticesUpdated = false;
        this._normalsUpdated = false;
        this._uvsUpdated = false;
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
        this._vertices = v;
        this._verticesUpdated = true;
    }

    set normals(n: IVector[]) {
        this._normals = n;
        this._normalsUpdated = true;
    }

    set uvs(uv: IVector[]) {
        this._uvs = uv;
        this._uvsUpdated = true;
    }

    set indices(is: number[]) {
        this._indices = is;
        this.normals = this._normals;
        this.uvs = this._uvs;
        this.vertices = this._vertices;
    }

    /**
     * Generates flat arrays of vertices, normals and uvs
     */
    private generateFlatArrays() {
        this._verticesFlatArray = new Float32Array(this._indices.length * 3);
        this._normalsFlatArray = new Float32Array(this._indices.length * 3);
        this._uvsFlatArray = new Float32Array(this._indices.length * 2);
    
        for(let i = 0; i < this._indices.length; i++) {
            this._verticesFlatArray[i * 3] = this._vertices[this._indices[i]].x;
            this._verticesFlatArray[i * 3 + 1] = this._vertices[this._indices[i]].y;
            this._verticesFlatArray[i * 3 + 2] = this._vertices[this._indices[i]].z;
            this._normalsFlatArray[i * 3] = this._normals[this._indices[i]].x;
            this._normalsFlatArray[i * 3 + 1] = this._normals[this._indices[i]].y;
            this._normalsFlatArray[i * 3 + 2] = this._normals[this._indices[i]].z;
            this._uvsFlatArray[i * 2] = this._uvs[this._indices[i]].x;
            this._uvsFlatArray[i * 2 + 1] = this._uvs[this._indices[i]].y;
        }

        this._verticesUpdated = false;
        this._normalsUpdated = false;
        this._uvsUpdated = false;
    }
}

export default Mesh;