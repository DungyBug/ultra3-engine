import ClientEngine from "../client-engine";
import ColorMode from "../constants/color-mode";
import SamplingMode from "../constants/sampling-mode";
import TypedArray from "../contracts/common/typed-array";
import TextureOptions, { TextureOptsToArrayType } from "../contracts/texture/texture-opts";
import ITexture2D from "../contracts/texture/texture2d";
import Texture2DOptions from "../contracts/texture/texture2d-opts";

class Texture2D<T extends TextureOptions = TextureOptions> implements ITexture2D<TextureOptsToArrayType<T>> {
    public offset: [number, number];
    public rotation: [number];
    public scale: [number, number];
    public magSamplingMode: SamplingMode;
    public minSamplingMode: SamplingMode;
    public frames: Array<TypedArray>;
    public width: number;
    public height: number;
    public framesPerSecond: number;
    protected engine: ClientEngine;
    protected registered: boolean;
    readonly colorMode: ColorMode;

    constructor(options: Texture2DOptions<T>, engine: ClientEngine, register: boolean = true) {
        this.offset = options.offset || [0, 0];
        this.rotation = options.rotation || [0];
        this.scale = options.scale || [1, 1];
        this.width = options.width;
        this.height = options.height;
        this.magSamplingMode = options.magSamplingMode;
        this.minSamplingMode = options.minSamplingMode;
        this.colorMode = options.colorMode;
        this.framesPerSecond = options.framesPerSecond;
        this.frames = options.frames;

        this.engine = engine;
        this.registered = register;

        if(register) {
            this.engine.registerTexture2D(this);
        }
    }

    /**
     * Loads image data from provided url and saves it.
     * **Note**: RGBA color mode expected ( as canvas returns image data in RGBA color mode )
     * @param url - url from which to fetch image
     * @param frame - frame where to save image data
     * @returns this
     */
    load(url: string, frame: number = 0): Texture2D<T> {
        const image = new Image();
        image.src = url;

        image.onload = () => {
            const tempcanvas = document.createElement("canvas");
            const tmpctx = tempcanvas.getContext("2d");
            
            tempcanvas.width = image.width;
            tempcanvas.height = image.height;
            this.width = image.width;
            this.height = image.height;
            tmpctx.drawImage(image, 0, 0);

            this.frames[frame] = new Uint8Array(tmpctx.getImageData(0, 0, image.width, image.height).data.buffer);

            // Register only if first frame is loaded
            if(this.frames[0] !== undefined) {
                this.register();
            }
        }

        return this;
    }

    register() {
        // Prevent registering texture if already registered
        if(!this.registered) {
            this.engine.registerTexture2D(this);
            this.registered = true;
        }
    }

    free() {
        this.engine.freeTexture(this);
        delete this.frames;
    }

    getRawData(time: number = 0): TextureOptsToArrayType<T> {
        return this.frames[Math.floor(time * this.framesPerSecond) % this.frames.length] as TextureOptsToArrayType<T>;
    }

    getFrame(frame: number): TextureOptsToArrayType<T> {
        return this.frames[frame] as TextureOptsToArrayType<T>;
    }

    get dimensions(): [number, number] {
        return [this.width, this.height];
    }
}

export default Texture2D;