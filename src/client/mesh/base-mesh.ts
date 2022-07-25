import { IVector } from "../../core/contracts/base/vector";
import IVector2D from "../../core/contracts/base/vector2d";
import DrawMode from "../constants/draw-mode";
import IBaseMesh from "../contracts/base-mesh";
import IBaseMeshOptions from "../contracts/mesh/base-mesh-opts";

class BaseMesh implements IBaseMesh {
    protected _vertices: Array<IVector>;
    pos: IVector;
    scale: IVector;
    rotation: IVector;
    drawMode: DrawMode;

    constructor(options: IBaseMeshOptions) {
        this.pos = options.pos || {x: 0, y: 0, z: 0};
        this.scale = options.scale || {x: 1, y: 1, z: 1};
        this.rotation = options.rotation || {x: 0, y: 0, z: 0};
        this._vertices = options.vertices || [];
        this.drawMode = options.drawMode || DrawMode.DYNAMIC;
    }
}

export default BaseMesh;
