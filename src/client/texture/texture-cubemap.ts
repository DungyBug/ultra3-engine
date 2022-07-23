import ClientEngine from "../client-engine";
import TextureOptions, { TextureOptsToArrayType } from "../contracts/texture/texture-opts";
import Texture2DOptions from "../contracts/texture/texture2d-opts";
import Texture2D from "./texture2d";

class TextureCubemap<T extends TextureOptions = TextureOptions> extends Texture2D<T> {
    constructor(options: Texture2DOptions<T>, engine: ClientEngine, register: boolean = true) {
        super(options, engine, false);

        if(register) {
            this.register();
        }
    }

    register(): void {
        if(this.registered) {
            return;
        }

        this.registered = true;
        this.engine.registerTextureCubemap(this);
    }

    /**
     * Loads image data from provided url and saves it.
     * **Note**: RGBA color mode expected ( as canvas returns image data in RGBA color mode )
     * @param url - url from which to fetch image
     * @param frame - frame where to save image data
     * @param coordinate - coordinate where to save data ( "+x", "-y", etc. )
     * @returns this
     */
    load(url: string, frame: number = 0, coordinate: "+x" | "-x" | "+y" | "-y" | "+z" | "-z" = "+x"): TextureCubemap<T> {
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

            const data = new Uint8Array(tmpctx.getImageData(0, 0, image.width, image.height).data.buffer);

            switch(coordinate) {
                case "+x": {
                    this.frames[frame * 6] = data;
                    break;
                }
                case "-x": {
                    this.frames[frame * 6 + 1] = data;
                    break;
                }
                case "+y": {
                    this.frames[frame * 6 + 2] = data;
                    break;
                }
                case "-y": {
                    this.frames[frame * 6 + 3] = data;
                    break;
                }
                case "+z": {
                    this.frames[frame * 6 + 4] = data;
                    break;
                }
                case "-z": {
                    this.frames[frame * 6 + 5] = data;
                    break;
                }
            }

            // Register only if all first frame is loaded
            if(this.frames[0] !== undefined && this.frames[1] !== undefined && this.frames[2] !== undefined && this.frames[3] !== undefined && this.frames[4] !== undefined && this.frames[5] !== undefined) {
                this.register();
            }
        }

        return this;
    }

    getRawData(time: number = 0, coordinate: "+x" | "-x" | "+y" | "-y" | "+z" | "-z" = "+x"): TextureOptsToArrayType<T> {
        return this.getFrame(Math.floor(time * this.framesPerSecond) % this.frames.length, coordinate);
    }

    getFrame(frame: number, coordinate: "+x" | "-x" | "+y" | "-y" | "+z" | "-z" = "+x"): TextureOptsToArrayType<T> {
        switch(coordinate) {
            case "+x": {
                return this.frames[frame * 6] as TextureOptsToArrayType<T>;
                break;
            }
            case "-x": {
                return this.frames[frame * 6 + 1] as TextureOptsToArrayType<T>;
                break;
            }
            case "+y": {
                return this.frames[frame * 6 + 2] as TextureOptsToArrayType<T>;
                break;
            }
            case "-y": {
                return this.frames[frame * 6 + 3] as TextureOptsToArrayType<T>;
                break;
            }
            case "+z": {
                return this.frames[frame * 6 + 4] as TextureOptsToArrayType<T>;
                break;
            }
            case "-z": {
                return this.frames[frame * 6 + 5] as TextureOptsToArrayType<T>;
                break;
            }
        }
    }
}

export default TextureCubemap;