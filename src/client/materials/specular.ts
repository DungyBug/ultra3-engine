import SamplingMode from "../constants/sampling-mode";
import TypedArray from "../contracts/common/typed-array";
import ISpecularMaterialProps from "../contracts/materials/specular-props";
import { IShader } from "../contracts/shader";
import ITexture2D from "../contracts/texture/texture2d";
import TexturedMaterial from "./textured";

class SpecularMaterial<T extends TypedArray = TypedArray> extends TexturedMaterial<T> {
    public specular: ITexture2D<T>;
    public factor: number;

    constructor(props: ISpecularMaterialProps<T>) {
        super(props.texture);

        this.specular = props.specular;
        this.factor = props.specularFactor;
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
            },
            {
                name: "specularSampler",
                value: this.specular
            },
            {
                name: "specularFactor",
                value: this.factor
            }
            ],
            name: "u3specular"
        }
    }
}

export default SpecularMaterial