import ClientEngine from "../client-engine";
import ColorMode from "../constants/color-mode";
import SamplingMode from "../constants/sampling-mode";
import TypedArray from "../contracts/common/typed-array";
import { TextureOptsToArrayType } from "../contracts/texture/texture-opts";
import ITexture3D from "../contracts/texture/texture3d";
import Texture3DOptions from "../contracts/texture/texture3d-opts";

class Texture3D<T extends Texture3DOptions = Texture3DOptions> implements ITexture3D<TextureOptsToArrayType<T>> {
    public offset: [number, number, number];
    public rotation: [number, number, number];
    public scale: [number, number, number];
    public magSamplingMode: SamplingMode;
    public minSamplingMode: SamplingMode;
    public frames: Array<TypedArray>;
    public width: number;
    public height: number;
    public depth: number;
    public framesPerSecond: number;
    readonly colorMode: ColorMode;
    private engine: ClientEngine;

    constructor(options: T, engine: ClientEngine, register: boolean = true) {
        this.offset = options.offset || [0, 0, 0];
        this.rotation = options.rotation || [0, 0, 0];
        this.scale = options.scale || [1, 1, 1];
        this.width = options.width;
        this.height = options.height;
        this.depth = options.depth;
        this.magSamplingMode = options.magSamplingMode;
        this.minSamplingMode = options.minSamplingMode;
        this.colorMode = options.colorMode;
        this.framesPerSecond = options.framesPerSecond;
        this.frames = options.frames;

        this.engine = engine;

        if(register) {
            this.engine.registerTexture3D(this);
        }
    }

    register() {
        this.engine.registerTexture3D(this);
    }

    free() {
        this.engine.freeTexture(this);
        delete this.frames;
    }

    getRawData(time: number = 0): TextureOptsToArrayType<T> {
        return this.frames[Math.floor(time * this.framesPerSecond) % this.frames.length] as TextureOptsToArrayType<T>;
    }

    get dimensions(): [number, number, number] {
        return [this.width, this.height, this.depth];
    }
}

export default Texture3D;