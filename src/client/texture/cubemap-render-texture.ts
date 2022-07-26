import ICubemapRenderTextureOpts from "../contracts/texture/cubemap-render-texture-opts";
import TextureFormat from "../constants/texture-format";
import TextureCubemap from "./texture-cubemap";
import ClientEngine from "../client-engine";
import ColorMode from "../constants/color-mode";
import BaseGraphicsModule from "../contracts/modules/graphics-module";
import BaseCamera from "../camera";
import Vector from "../../core/lib/vector";
import ClientMapObject from "../map/client-object";
import { Entity } from "../../core/entity";

class RenderTextureCubemap<T extends TextureFormat = TextureFormat> extends TextureCubemap {
    protected graphicsModule: BaseGraphicsModule;
    protected renderTextureObject: Record<string, unknown>;
    protected cameras: [BaseCamera, BaseCamera, BaseCamera, BaseCamera, BaseCamera, BaseCamera];
    protected attachment: "color" | "depth" | "stencil";
    protected textureFormat: TextureFormat;
    public entities: Array<Entity>;
    public mapObjects: Array<ClientMapObject>;
    
    constructor(opts: ICubemapRenderTextureOpts<T>, engine: ClientEngine, register: boolean = true) {
        super({
            width: opts.size,
            height: opts.size,
            textureFormat: opts.textureFormat,
            colorMode: ColorMode.RGB,
            framesPerSecond: 0,
            minSamplingMode: opts.minSamplingMode,
            magSamplingMode: opts.magSamplingMode,
            frames: null
        }, engine, false);
        this.graphicsModule = engine.getGraphicsModule();
        this.registered = false;
        this.attachment = opts.attachment;
        this.width = opts.size;
        this.height = opts.size;
        this.textureFormat = opts.textureFormat;
        this.cameras = opts.cameras || [
            new BaseCamera({fov: Math.PI / 2, rotation: {x: 0, y: -Math.PI / 2, z: Math.PI}}), // +x
            new BaseCamera({fov: Math.PI / 2, rotation: {x: 0, y: Math.PI / 2, z: Math.PI}}), // -x
            new BaseCamera({fov: Math.PI / 2, rotation: {x: Math.PI / 2, y: 0, z: Math.PI}}), // +y
            new BaseCamera({fov: Math.PI / 2, rotation: {x: Math.PI / 2, y: 0, z: 0}}), // -y
            new BaseCamera({fov: Math.PI / 2, rotation: {x: 0, y: Math.PI, z: Math.PI}}), // +z
            new BaseCamera({fov: Math.PI / 2, rotation: {x: 0, y: 0, z: Math.PI}})  // -z
        ];
        this.entities = [];
        this.mapObjects = [];

        if(register) {
            this.register();
        }
    }

    pushEntityToRenderList(entity: Entity) {
        this.entities.push(entity);
    }

    pushMapObjectToRenderList(mapObject: ClientMapObject) {
        this.mapObjects.push(mapObject);
    }

    setActiveCameras(cameras: [BaseCamera, BaseCamera, BaseCamera, BaseCamera, BaseCamera, BaseCamera]) {
        this.cameras = cameras;
    }

    getActiveCameras(): [BaseCamera, BaseCamera, BaseCamera, BaseCamera, BaseCamera, BaseCamera] {
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
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "+x", this.entities, this.mapObjects);
        this.graphicsModule.setActiveCamera(this.cameras[1]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "-x", this.entities, this.mapObjects);
        this.graphicsModule.setActiveCamera(this.cameras[2]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "+y", this.entities, this.mapObjects);
        this.graphicsModule.setActiveCamera(this.cameras[3]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "-y", this.entities, this.mapObjects);
        this.graphicsModule.setActiveCamera(this.cameras[4]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "+z", this.entities, this.mapObjects);
        this.graphicsModule.setActiveCamera(this.cameras[5]);
        this.graphicsModule.renderToRenderTextureCubemap(this.renderTextureObject, "-z", this.entities, this.mapObjects);

        // restore active camera
        this.graphicsModule.setActiveCamera(activeCamera);
    }

    free() {
        this.registered = false;
        this.graphicsModule.freeRenderTextureCubemap(this.renderTextureObject);
    }

    getRawData(time?: number, coordinate?: "+x" | "-x" | "+y" | "-y" | "+z" | "-z"): Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array {
        return null;
    }
}

export default RenderTextureCubemap;