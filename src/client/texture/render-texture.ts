import BaseCamera from "../camera";
import ClientEngine from "../client-engine";
import ColorMode from "../constants/color-mode";
import TextureFormat from "../constants/texture-format";
import BaseGraphicsModule from "../contracts/modules/graphics-module";
import IRenderTextureOpts from "../contracts/texture/render-texture-opts";
import TextureOptions from "../contracts/texture/texture-opts";
import Texture2D from "./texture2d";

class RenderTexture<T extends TextureFormat = TextureFormat> extends Texture2D {
    protected graphicsModule: BaseGraphicsModule;
    protected renderTextureObject: Record<string, unknown>;
    protected camera: BaseCamera;
    protected attachment: "color" | "depth" | "stencil";
    protected textureFormat: TextureFormat;

    constructor(opts: IRenderTextureOpts<T>, engine: ClientEngine, register: boolean = true) {
        super({
            width: opts.width,
            height: opts.height,
            textureFormat: opts.textureFormat,
            colorMode: ColorMode.RGB,
            framesPerSecond: 1,
            magSamplingMode: opts.magSamplingMode,
            minSamplingMode: opts.minSamplingMode,
            frames: null
        }, engine, false);
        this.graphicsModule = engine.getGraphicsModule();
        this.registered = false;
        this.attachment = opts.attachment;
        this.width = opts.width;
        this.height = opts.height;
        this.textureFormat = opts.textureFormat;
        this.camera = opts.camera || this.graphicsModule.getActiveCamera();

        if(register) {
            this.register();
        }
    }

    setActiveCamera(camera: BaseCamera) {
        this.camera = camera;
    }

    getActiveCamera(): BaseCamera {
        return this.camera;
    }

    register() {
        if(this.registered) {
            return;
        }

        this.registered = true;
        this.renderTextureObject = this.graphicsModule.createRenderTexture(this, this.attachment, this.width, this.height, this.textureFormat);
    }

    render() {
        const activeCamera = this.graphicsModule.getActiveCamera();
        this.graphicsModule.setActiveCamera(this.camera);
        this.graphicsModule.renderToRenderTexture(this.renderTextureObject);

        // restore active camera
        this.graphicsModule.setActiveCamera(activeCamera);
    }

    free() {
        this.registered = false;
        this.graphicsModule.freeRenderTexture(this.renderTextureObject);
    }

    load(url: string, frame?: number): Texture2D<TextureOptions> {
        return this;
    }
}

export default RenderTexture;