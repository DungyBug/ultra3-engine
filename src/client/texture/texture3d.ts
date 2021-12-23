import ColorMode from "../constants/color-mode";
import SamplingMode from "../constants/sampling-mode";
import TypedArray from "../contracts/common/typed-array";
import { TextureOptsToArrayType } from "../contracts/texture/texture-opts";
import ITexture3D from "../contracts/texture/texture3d";
import Texture3DOptions from "../contracts/texture/texture3d-opts";

class Texture3D<T extends Texture3DOptions> implements ITexture3D<TextureOptsToArrayType<T>> {
    protected width: number;
    protected height: number;
    protected depth: number;
    public samplingMode: SamplingMode;
    readonly colorMode: ColorMode;
    protected frames: Array<TypedArray>;
    protected framesPerSecond: number;

    constructor(options: T) {
        this.width = options.width;
        this.height = options.height;
        this.depth = options.depth;
        this.samplingMode = options.samplingMode;
        this.colorMode = options.colorMode;
        this.framesPerSecond = options.framesPerSecond;
        this.frames = options.frames
    }

    getRawData(time: number = 0): TextureOptsToArrayType<T> {
        return this.frames[Math.floor(time * this.framesPerSecond) % this.frames.length] as TextureOptsToArrayType<T>;
    }

    get dimensions(): [number, number, number] {
        return [this.width, this.height, this.depth];
    }
}

export default Texture3D;