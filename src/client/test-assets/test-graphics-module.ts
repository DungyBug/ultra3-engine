import { BaseModuleEvents } from "../../core/contracts/module";
import BaseModuleContext from "../../core/contracts/module-context";
import { Entity } from "../../core/entity";
import { MapObject } from "../../core/map-object";
import OrthogonalCamera from "../cameras/orthogonal-camera";
import PerspectiveCamera from "../cameras/perspective-camera";
import SamplingMode from "../constants/sampling-mode";
import TextureFormat from "../constants/texture-format";
import ClientWorldEvents from "../contracts/client-world-events";
import ClientGraphicsModuleEvents from "../contracts/modules/client-graphics-module-events";
import BaseGraphicsModule, { BaseGraphicsModuleEvents } from "../contracts/modules/graphics-module";
import IGraphicsParameters from "../contracts/modules/graphics-parameters";
import { IShader } from "../contracts/shader";
import TextureOptions from "../contracts/texture/texture-opts";
import Texture3DOptions from "../contracts/texture/texture3d-opts";
import Scene from "../scene";
import RenderTextureCubemap from "../texture/cubemap-render-texture";
import RenderTexture from "../texture/render-texture";
import TextureCubemap from "../texture/texture-cubemap";
import Texture2D from "../texture/texture2d";
import Texture3D from "../texture/texture3d";

class TestGraphicsModule extends BaseGraphicsModule<ClientGraphicsModuleEvents & BaseGraphicsModuleEvents & BaseModuleEvents & ClientWorldEvents> {
    private camera: PerspectiveCamera | OrthogonalCamera;
    private activeScene: Scene<Entity, MapObject>;
    private _textureCounter: number = 0;

    constructor() {
        super();

        this.camera = new PerspectiveCamera();
        this.activeScene = new Scene<Entity, MapObject>();
    }

    get width() { return 800 }
    get height() { return 600 }

    get privateContext(): BaseModuleContext<BaseGraphicsModuleEvents & BaseModuleEvents & ClientWorldEvents> {
        return this.context as BaseModuleContext<BaseGraphicsModuleEvents & BaseModuleEvents & ClientWorldEvents>;
    }

    init(parameters: IGraphicsParameters & { context: BaseModuleContext<BaseGraphicsModuleEvents & BaseModuleEvents & ClientWorldEvents>; }) {
        super.init(parameters);
    }

    setActiveCamera(camera: PerspectiveCamera | OrthogonalCamera): void {
        this.camera = camera;
    }

    getActiveCamera(): PerspectiveCamera | OrthogonalCamera {
        return this.camera
    }

    createRenderTexture(renderTexture: RenderTexture<TextureFormat>, attachment: "color" | "depth" | "stencil", width: number, height: number, format: TextureFormat, minSamplingMode: SamplingMode, magSamplingMode: SamplingMode) {
        return {
            renderTexture,
            attachment,
            width, height,
            format,
            minSamplingMode,
            magSamplingMode
        }
    }

    renderToRenderTexture(object: Record<string, unknown>, scene: Scene<Entity, MapObject>): void {}
    freeRenderTexture(object: Record<string, unknown>): void {}

    createRenderTextureCubemap(renderTextureCubemap: RenderTextureCubemap<TextureFormat>, attachment: "color" | "depth" | "stencil", size: number, format: TextureFormat, minSamplingMode: SamplingMode, magSamplingMode: SamplingMode) {
        return {
            renderTextureCubemap,
            attachment,
            size,
            format,
            minSamplingMode,
            magSamplingMode
        }
    }

    renderToRenderTextureCubemap(object: Record<string, unknown>, coordinate: "+x" | "+y" | "+z" | "-x" | "-y" | "-z", scene: Scene<Entity, MapObject>): void {}
    freeRenderTextureCubemap(object: Record<string, unknown>): void {}

    registerShader(name: string, vertex: IShader, fragment: IShader): void {}

    restoreActiveScene(): void {}

    setActiveScene(scene: Scene<Entity, MapObject>): void {
        this.activeScene = scene;
    }

    getActiveScene(): Scene<Entity, MapObject> {
        return this.activeScene
    }

    render(scene?: Scene<Entity, MapObject> | undefined): void {}

    createTexture2D<T extends TextureOptions = TextureOptions>(texture: Texture2D<T>): number {
        return this._textureCounter++;
    }

    createTexture3D<T extends Texture3DOptions = Texture3DOptions>(texture: Texture3D<T>): number {
        return this._textureCounter++;
    }

    createTextureCubemap<T extends TextureOptions = TextureOptions>(texture: TextureCubemap<T>): number {
        return this._textureCounter++;
    }

    updateTexture2D(textureId: number, time: number, timedelta: number): void {}
    updateTexture3D(textureId: number, time: number, timedelta: number): void {}
    updateTextureCubemap(textureId: number, time: number, timedelta: number): void {}

    freeTexture(textureId: number): void {}
}

export default TestGraphicsModule;