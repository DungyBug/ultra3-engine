// <T extends Uint8Array | Uint16Array | Uint32Array | Float32Array | Float64Array>

import ColorMode from "../../constants/color-mode";
import SamplingMode from "../../constants/sampling-mode";
import TextureFormat from "../../constants/texture-format";

interface IUint8TextureOptions {
    frames: Array<Uint8Array>;
    framesPerSecond: number;
    colorMode: ColorMode;
    textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE;
    samplingMode: SamplingMode;
}

interface IInt8TextureOptions {
    frames: Array<Int8Array>;
    framesPerSecond: number;
    colorMode: ColorMode;
    textureFormat: TextureFormat.TEXTUREFORMAT_BYTE;
    samplingMode: SamplingMode;
}

interface IUint16TextureOptions {
    frames: Array<Uint16Array>;
    framesPerSecond: number;
    colorMode: ColorMode;
    textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_SHORT;
    samplingMode: SamplingMode;
}

interface IInt16TextureOptions {
    frames: Array<Int16Array>;
    framesPerSecond: number;
    colorMode: ColorMode;
    textureFormat: TextureFormat.TEXTUREFORMAT_SHORT;
    samplingMode: SamplingMode;
}

interface IUint32TextureOptions {
    frames: Array<Uint32Array>;
    framesPerSecond: number;
    colorMode: ColorMode;
    textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_INT;
    samplingMode: SamplingMode;
}

interface IInt32TextureOptions {
    frames: Array<Int32Array>;
    framesPerSecond: number;
    colorMode: ColorMode;
    textureFormat: TextureFormat.TEXTUREFORMAT_INT;
    samplingMode: SamplingMode;
}

interface IFloat16TextureOptions {
    frames: Array<Uint16Array>;
    framesPerSecond: number;
    colorMode: ColorMode;
    textureFormat: TextureFormat.TEXTUREFORMAT_HALF_FLOAT;
    samplingMode: SamplingMode;
}

interface IFloat32TextureOptions {
    frames: Array<Float32Array>;
    framesPerSecond: number;
    colorMode: ColorMode;
    textureFormat: TextureFormat.TEXTUREFORMAT_FLOAT;
    samplingMode: SamplingMode;
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

export default TextureOptions;
export { TextureOptsToArrayType, IUint8TextureOptions, IUint16TextureOptions, IUint32TextureOptions, IInt8TextureOptions, IInt16TextureOptions, IInt32TextureOptions, IFloat32TextureOptions, IFloat16TextureOptions };