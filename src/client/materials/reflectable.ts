import ReflectionType from "../constants/reflection-type";
import TypedArray from "../contracts/common/typed-array";
import ReflectableMaterialProps from "../contracts/materials/reflectable-props";
import { IShader } from "../contracts/shader";
import ITexture2D from "../contracts/texture/texture2d";
import TexturedMaterial from "./textured";

class ReflectableMaterial<T extends TypedArray = TypedArray, U extends TypedArray = T> extends TexturedMaterial<T> {
    protected reflectionType: ReflectionType;
    protected textureSize: number;
    protected reflectionTexture: ITexture2D<U>;
    public roughness: number;

    constructor(props: ReflectableMaterialProps<T, U>) {
        super(props.texture);

        this.roughness = props.roughness;
        this.reflectionType = props.reflectionType;

        switch (props.reflectionType) {
            case ReflectionType.DynamicReflection: {
                this.textureSize = props.textureSize;
                break;
            }
            case ReflectionType.FixedReflection: {
                this.reflectionTexture = props.reflectionTexture;
                break;
            }
        }
    }

    getShader(): IShader {
        let parentResult = super.getShader();
        
        return {
            ...parentResult,
            params: [
                ...parentResult.params,
                {
                    name: "reflectionSampler",
                    value: this.reflectionTexture
                }
            ],
            name: "u3reflectable"
        };
    }
}

export default ReflectableMaterial;