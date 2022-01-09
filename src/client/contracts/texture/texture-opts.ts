import ColorMode from "../../constants/color-mode";
import SamplingMode from "../../constants/sampling-mode";
import TextureFormat from "../../constants/texture-format";
import TypedArray from "../common/typed-array";

interface IBaseTextureOptions {
    colorMode: ColorMode;
    framesPerSecond: number;
    magSamplingMode: SamplingMode;
    minSamplingMode: SamplingMode;
    shift?: Array<number>;
    rotation?: Array<number>;
    scale?: Array<number>;
}

interface IUint8TextureOptions extends IBaseTextureOptions {
    frames: Array<Uint8Array>;
    textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE;
}

interface IInt8TextureOptions extends IBaseTextureOptions {
    frames: Array<Int8Array>;
    textureFormat: TextureFormat.TEXTUREFORMAT_BYTE;
}

interface IUint16TextureOptions extends IBaseTextureOptions {
    frames: Array<Uint16Array>;
    textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_SHORT;
}

interface IInt16TextureOptions extends IBaseTextureOptions {
    frames: Array<Int16Array>;
    textureFormat: TextureFormat.TEXTUREFORMAT_SHORT;
}

interface IUint32TextureOptions extends IBaseTextureOptions {
    frames: Array<Uint32Array>;
    textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_INT;
}

interface IInt32TextureOptions extends IBaseTextureOptions {
    frames: Array<Int32Array>;
    textureFormat: TextureFormat.TEXTUREFORMAT_INT;
}

interface IFloat16TextureOptions extends IBaseTextureOptions {
    frames: Array<Uint16Array>;
    textureFormat: TextureFormat.TEXTUREFORMAT_HALF_FLOAT;
}

interface IFloat32TextureOptions extends IBaseTextureOptions {
    frames: Array<Float32Array>;
    textureFormat: TextureFormat.TEXTUREFORMAT_FLOAT;
}

type TextureOptions = IUint8TextureOptions | IUint16TextureOptions | IUint32TextureOptions | IInt8TextureOptions | IInt16TextureOptions | IInt32TextureOptions | IFloat32TextureOptions | IFloat16TextureOptions;

type TextureOptsToArrayType<T extends TextureOptions> = T extends IUint8TextureOptions 
    ? Uint8Array 
    : T extends IUint16TextureOptions 
        ? Uint16Array 
        : T extends IUint32TextureOptions 
            ? Uint32Array 
            : T extends IInt8TextureOptions 
                ? Int8Array 
                : T extends IInt16TextureOptions 
                    ? Int16Array 
                    : T extends IInt32TextureOptions 
                        ? Int32Array 
                        : T extends IFloat32TextureOptions 
                            ? Float32Array 
                            : T extends IFloat16TextureOptions 
                                ? Uint16Array 
                                : never;

/*
U - How to interpretate Uint16Array: "Float16" - as Float16Array, "Uint16" - as Uint16Array.
*/
type ArrayTypeToTextureOpts<T extends TypedArray, U extends "Float16" | "Uint16" = "Uint16"> = T extends Uint8Array 
    ? IUint8TextureOptions 
    : T extends Uint16Array 
        ? (U extends "Float16" ? IFloat16TextureOptions : IUint16TextureOptions) 
        : T extends Uint32Array 
            ? IUint32TextureOptions 
            : T extends Int8Array 
                ? IInt8TextureOptions 
                : T extends Int16Array 
                    ? IInt16TextureOptions 
                    : T extends Int32Array 
                        ? IInt32TextureOptions 
                        : T extends Float32Array 
                            ? IFloat32TextureOptions
                            : never;

export default TextureOptions;
export { TextureOptsToArrayType, ArrayTypeToTextureOpts, IUint8TextureOptions, IUint16TextureOptions, IUint32TextureOptions, IInt8TextureOptions, IInt16TextureOptions, IInt32TextureOptions, IFloat32TextureOptions, IFloat16TextureOptions };