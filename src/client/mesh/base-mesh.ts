import { IVector } from "../../core/contracts/base/vector";
import DrawMode from "../constants/draw-mode";
import IBaseMesh from "../contracts/base-mesh";
import IBaseMeshOptions from "../contracts/mesh/base-mesh-opts";

class BaseMesh implements IBaseMesh {
    protected vertices: Array<IVector>;
    pos: IVector;
    scale: IVector;
    rotation: IVector;
    drawMode: DrawMode;

    constructor(options: IBaseMeshOptions) {
        this.pos = options.pos;
        this.scale = options.scale;
        this.rotation = options.rotation;
        this.vertices = options.vertices;
        this.drawMode = options.drawMode || DrawMode.DYNAMIC;
    }
}

export default BaseMesh;
