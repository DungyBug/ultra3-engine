import { IVector } from "../../core/contracts/base/vector";
import TypedArray from "../contracts/common/typed-array";
import IVolume from "../contracts/mesh/volume";
import IVolumeOptions from "../contracts/mesh/volume-opts";
import ITexture3D from "../contracts/texture/texture3d";
import VolumetricMaterial from "../materials/volumetric";

class Volume implements IVolume {
    private _material: VolumetricMaterial;
    protected texture: ITexture3D<TypedArray>;
    public pos: IVector;
    public scale: IVector;
    public rotation: IVector;

    constructor(options: IVolumeOptions) {
        this.pos = options.pos || {x: 0, y: 0, z: 0};
        this.scale = options.scale || {x: 0, y: 0, z: 0};
        this.rotation = options.rotation || {x: 0, y: 0, z: 0};
        this.texture = options.texture;
        this._material = new VolumetricMaterial(this.texture);
    }

    getRawData(at: number): TypedArray {
        return this.texture.getRawData(at);
    }

    get material() {
        return this._material;
    }
}

export default Volume;