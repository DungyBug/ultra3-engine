import ColorMode from "../constants/color-mode";
import SamplingMode from "../constants/sampling-mode";
import TypedArray from "../contracts/common/typed-array";
import { TextureOptsToArrayType } from "../contracts/texture/texture-opts";
import ITexture2D from "../contracts/texture/texture2d";
import Texture2DOptions from "../contracts/texture/texture2d-opts";

class Texture2D<T extends Texture2DOptions> implements ITexture2D<TextureOptsToArrayType<T>> {
    protected width: number;
    protected height: number;
    public samplingMode: SamplingMode;
    readonly colorMode: ColorMode;
    protected frames: Array<TypedArray>;
    protected framesPerSecond: number;

    constructor(options: T) {
        this.width = options.width;
        this.height = options.height;
        this.samplingMode = options.samplingMode;
        this.colorMode = options.colorMode;
        this.framesPerSecond = options.framesPerSecond;
        this.frames = options.frames
    }

    getRawData(time: number = 0): TextureOptsToArrayType<T> {
        return this.frames[Math.floor(time * this.framesPerSecond) % this.frames.length] as TextureOptsToArrayType<T>;
    }

    get dimensions(): [number, number] {
        return [this.width, this.height];
    }
}

export default Texture2D;