import { IVector } from "../../core/contracts/base/vector";
import { EventEmitter } from "../../core/services/event-emitter";
import DrawMode from "../constants/draw-mode";
import IBaseMesh from "../contracts/base-mesh";
import BaseMeshEvents from "../contracts/mesh/base-mesh-events";
import IBaseMeshOptions from "../contracts/mesh/base-mesh-opts";

class BaseMesh extends EventEmitter<BaseMeshEvents> implements IBaseMesh {
    protected _vertices: Array<IVector>;
    pos: IVector;
    scale: IVector;
    rotation: IVector;
    drawMode: DrawMode;
    visible: boolean;

    constructor(options: IBaseMeshOptions) {
        super();
        this.pos = options.pos || {x: 0, y: 0, z: 0};
        this.scale = options.scale || {x: 1, y: 1, z: 1};
        this.rotation = options.rotation || {x: 0, y: 0, z: 0};
        this._vertices = options.vertices || [];
        this.drawMode = options.drawMode || DrawMode.DYNAMIC;
        this.visible = options.visible || true;
    }
}

export default BaseMesh;
