import TypedArray from "../common/typed-array";
import ITexture2D from "../texture/texture2d";

interface ISpecularMaterialProps<T extends TypedArray> {
    texture: ITexture2D<T>;
    specular: ITexture2D<T>;
    specularFactor: number;
}

export default ISpecularMaterialProps;