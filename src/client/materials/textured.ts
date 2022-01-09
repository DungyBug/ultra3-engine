import SamplingMode from "../constants/sampling-mode";
import TypedArray from "../contracts/common/typed-array";
import IMaterial from "../contracts/material";
import { IShader } from "../contracts/shader";
import ITexture2D from "../contracts/texture/texture2d";

class TexturedMaterial<T extends TypedArray = TypedArray> implements IMaterial {
    public texture: ITexture2D<T>;

    constructor(texture: ITexture2D<T>) {
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
            name: "u3textured"
        }
    }
}

export default TexturedMaterial;