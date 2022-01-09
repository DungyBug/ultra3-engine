import ColorMode from "../constants/color-mode";
import SamplingMode from "../constants/sampling-mode";
import TypedArray from "../contracts/common/typed-array";
import TextureOptions, { TextureOptsToArrayType } from "../contracts/texture/texture-opts";
import ITexture2D from "../contracts/texture/texture2d";
import Texture2DOptions from "../contracts/texture/texture2d-opts";

class Texture2D<T extends TextureOptions> implements ITexture2D<TextureOptsToArrayType<T>> {
    public offset: [number, number];
    public rotation: [number];
    public scale: [number, number];
    public magSamplingMode: SamplingMode;
    public minSamplingMode: SamplingMode;
    protected width: number;
    protected height: number;
    protected frames: Array<TypedArray>;
    protected framesPerSecond: number;
    readonly colorMode: ColorMode;

    constructor(options: Texture2DOptions<T>) {
        this.offset = options.offset || [0, 0];
        this.rotation = options.rotation || [0];
        this.scale = options.scale || [1, 1];
        this.width = options.width;
        this.height = options.height;
        this.magSamplingMode = options.magSamplingMode;
        this.minSamplingMode = options.minSamplingMode;
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