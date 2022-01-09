import SamplingMode from "../constants/sampling-mode";
import TypedArray from "../contracts/common/typed-array";
import IMaterial from "../contracts/material";
import { IShader } from "../contracts/shader";
import ITexture3D from "../contracts/texture/texture3d";

class VolumetricMaterial<T extends TypedArray = TypedArray> implements IMaterial {
    public texture: ITexture3D<T>;

    constructor(texture: ITexture3D<T>) {
        this.texture = texture;
    }

    getShader(): IShader {
        return {
            params: [{
                name: "textureSampler",
                value: this.texture
            },
            {
                name: "useMagBicubicFiltration",
                value: this.texture.magSamplingMode === SamplingMode.BICUBIC
            },
            {
                name: "useMinBicubicFiltration",
                value: this.texture.minSamplingMode === SamplingMode.BICUBIC
            }
            ],
            name: "U3Volumetric"
        }
    }
}

export default VolumetricMaterial;