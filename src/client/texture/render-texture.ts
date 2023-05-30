import BaseCamera from "../cameras/base-camera";
import OrthogonalCamera from "../cameras/orthogonal-camera";
import PerspectiveCamera from "../cameras/perspective-camera";
import ClientEngine from "../client-engine";
import ColorMode from "../constants/color-mode";
import TextureFormat from "../constants/texture-format";
import BaseGraphicsModule from "../contracts/modules/graphics-module";
import IRenderTextureOpts from "../contracts/texture/render-texture-opts";
import TextureOptions from "../contracts/texture/texture-opts";
import Scene from "../scene";
import Texture2D from "./texture2d";

class RenderTexture<T extends TextureFormat = TextureFormat> extends Texture2D {
    protected graphicsModule: BaseGraphicsModule;
    protected renderTextureObject: Record<string, unknown>;
    protected camera: PerspectiveCamera | OrthogonalCamera;
    protected attachment: "color" | "depth" | "stencil";
    protected textureFormat: TextureFormat;
    public scene: Scene;

    constructor(opts: IRenderTextureOpts<T>, engine: ClientEngine, register: boolean = true) {
        super({
            width: opts.width,
            height: opts.height,
            textureFormat: opts.textureFormat,
            colorMode: ColorMode.RGB,
            framesPerSecond: 0,
            magSamplingMode: opts.magSamplingMode,
            minSamplingMode: opts.minSamplingMode,
            frames: []
        }, engine, false);
        
        const graphicsModule = engine.getGraphicsModule();

        if(!graphicsModule) {
            throw new Error("Unable to create RenderTexture: setup graphics module first.");
        }

        this.graphicsModule = graphicsModule;
        this.registered = false;
        this.attachment = opts.attachment;
        this.width = opts.width;
        this.height = opts.height;
        this.textureFormat = opts.textureFormat;
        this.camera = opts.camera || this.graphicsModule.getActiveCamera();
        this.scene = new Scene();
        this.renderTextureObject = {};

        if(register) {
            this.register();
        }
    }

    setActiveCamera(camera: PerspectiveCamera | OrthogonalCamera) {
        this.camera = camera;
    }

    getActiveCamera(): PerspectiveCamera | OrthogonalCamera {
        return this.camera;
    }

    register() {
        if(this.registered) {
            return;
        }

        this.registered = true;
        this.renderTextureObject = this.graphicsModule.createRenderTexture(this, this.attachment, this.width, this.height, this.textureFormat, this.minSamplingMode, this.magSamplingMode);
    }

    render() {
        const activeCamera = this.graphicsModule.getActiveCamera();
        this.graphicsModule.setActiveCamera(this.camera);
        this.graphicsModule.renderToRenderTexture(this.renderTextureObject, this.scene);

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

    getRawData(time?: number): Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | Float32Array {
        return new Uint8Array(0);
    }
}

export default RenderTexture;