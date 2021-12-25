import { IVector } from "../../core/contracts/base/vector";
import IBaseMesh from "../contracts/base-mesh";
import IMaterial from "../contracts/material";
import IBaseMeshOptions from "../contracts/mesh/base-mesh-opts";

class BaseMesh implements IBaseMesh {
    protected verticies: Array<IVector>;
    pos: IVector;
    scale: IVector;
    rotation: IVector;
    material: IMaterial;

    constructor(options: IBaseMeshOptions) {
        this.pos = options.pos;
        this.scale = options.scale;
        this.rotation = options.rotation;
        this.material = options.material;
        this.verticies = options.verticies;
    }
}

export default BaseMesh;