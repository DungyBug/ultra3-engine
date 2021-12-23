import ReflectionType from "../../constants/reflection-type";
import TypedArray from "../common/typed-array";
import ITexture2D from "../texture/texture2d";

export interface IBaseReflectableMaterialProps<T extends ReflectionType, U extends TypedArray = TypedArray> {
    reflectionType: T;
    texture: ITexture2D<U>;
    roughness: number;
}

export interface INoReflectionReflectableMaterialProps<T extends TypedArray = TypedArray> extends IBaseReflectableMaterialProps<ReflectionType.NoReflection, T> {};

export interface IFixedReflectionTextureReflectableMaterialProps<T extends TypedArray, U extends TypedArray = T> extends IBaseReflectableMaterialProps<ReflectionType.FixedReflection, T> {
    reflectionTexture: ITexture2D<U>;
}

export interface IDynamicReflectionTextureReflectableMaterialProps<T extends TypedArray> extends IBaseReflectableMaterialProps<ReflectionType.DynamicReflection, T> {
    textureSize: number;
}

type ReflectableMaterialProps<T extends TypedArray = TypedArray, U extends TypedArray = T> = 
    | INoReflectionReflectableMaterialProps<T>
    | IDynamicReflectionTextureReflectableMaterialProps<T>
    | IFixedReflectionTextureReflectableMaterialProps<T, U>;

export default ReflectableMaterialProps;