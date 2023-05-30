import ICubemapRenderTextureOpts from "../contracts/texture/cubemap-render-texture-opts";
import TextureFormat from "../constants/texture-format";
import TextureCubemap from "./texture-cubemap";
import ClientEngine from "../client-engine";
import ColorMode from "../constants/color-mode";
import BaseGraphicsModule from "../contracts/modules/graphics-module";
import Vector from "../../core/lib/vector";
import Scene from "../scene";
import OrthogonalCamera from "../cameras/orthogonal-camera";
import PerspectiveCamera from "../cameras/perspective-camera";

class RenderTextureCubemap<T extends TextureFormat = TextureFormat> extends TextureCubemap {
    protected graphicsModule: BaseGraphicsModule;
    protected renderTextureObject: Record<string, unknown>;
    protected cameras: [PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera] | [OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera];
    protected attachment: "color" | "depth" | "stencil";
    protected textureFormat: TextureFormat;
    public scene: Scene;
    
    constructor(opts: ICubemapRenderTextureOpts<T>, engine: ClientEngine, register: boolean = true) {
        super({
            width: opts.size,
            height: opts.size,
            textureFormat: opts.textureFormat,
            colorMode: ColorMode.RGB,
            framesPerSecond: 0,
            minSamplingMode: opts.minSamplingMode,
            magSamplingMode: opts.magSamplingMode,
            frames: []
        }, engine, false);

        const graphicsModule = engine.getGraphicsModule();

        if(!graphicsModule) {
            throw new Error("Unable to create RenderTextureCubemap: setup graphics module first.");
        }

        this.graphicsModule = graphicsModule;
        this.registered = false;
        this.attachment = opts.attachment;
        this.width = opts.size;
        this.height = opts.size;
        this.textureFormat = opts.textureFormat;
        this.cameras = opts.cameras || [
            new PerspectiveCamera({fov: Math.PI / 2, rotation: {x: 0, y: -Math.PI / 2, z: Math.PI}}), // +x
            new PerspectiveCamera({fov: Math.PI / 2, rotation: {x: 0, y: Math.PI / 2, z: Math.PI}}), // -x
            new PerspectiveCamera({fov: Math.PI / 2, rotation: {x: Math.PI / 2, y: 0, z: Math.PI}}), // +y
            new PerspectiveCamera({fov: Math.PI / 2, rotation: {x: Math.PI / 2, y: 0, z: 0}}), // -y
            new PerspectiveCamera({fov: Math.PI / 2, rotation: {x: 0, y: Math.PI, z: Math.PI}}), // +z
            new PerspectiveCamera({fov: Math.PI / 2, rotation: {x: 0, y: 0, z: Math.PI}})  // -z
        ];
        this.scene = new Scene();
        this.renderTextureObject = {};

        if(register) {
            this.register();
        }
    }

    setActiveCameras(cameras: [PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera] | [OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera]) {
        this.cameras = cameras;
    }

    getActiveCameras(): [PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera] | [OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera] {
        return this.cameras;
    }

    setPosition(pos: Vector) {
        for(const camera of this.cameras) {
            camera.position = pos;
        }
    }

    register() {
        if(this.registered) {
            return;
        }

        this.registered = true;
        this.renderTextureObject = this.graphicsModule.createRenderTextureCubemap(this, this.attachment, this.width, this.textureFormat, this.minSamplingMode, this.magSamplingMode);
    }

    render() {
        const activeCamera = this.graphicsModule.getActiveCamera();

        this.graphicsModule.setActiveCamera(this.cameras[0]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "+x", this.scene);
        this.graphicsModule.setActiveCamera(this.cameras[1]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "-x", this.scene);
        this.graphicsModule.setActiveCamera(this.cameras[2]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "+y", this.scene);
        this.graphicsModule.setActiveCamera(this.cameras[3]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "-y", this.scene);
        this.graphicsModule.setActiveCamera(this.cameras[4]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "+z", this.scene);
        this.graphicsModule.setActiveCamera(this.cameras[5]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "-z", this.scene);

        // restore active camera
        this.graphicsModule.setActiveCamera(activeCamera);
    }

    free() {
        this.registered = false;
        this.graphicsModule.freeRenderTextureCubemap(this.renderTextureObject);
    }

    getRawData(time?: number, coordinate?: "+x" | "-x" | "+y" | "-y" | "+z" | "-z"): Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array {
        return new Uint8Array(0);
    }
}

export default RenderTextureCubemap;