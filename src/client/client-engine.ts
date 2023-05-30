import BaseModuleContext from "../core/contracts/module-context";
import WorldEvents from "../core/contracts/world-events";
import WorldModuleEvents from "../core/contracts/world-module-events";
import Engine from "../core/engine"
import { World } from "../core/world";
import ClientWorld from "./client-world";
import ClientWorldEvents from "./contracts/client-world-events";
import ClientGraphicsModuleEvents from "./contracts/modules/client-graphics-module-events";
import BaseGraphicsModule from "./contracts/modules/graphics-module";
import RequestedTexture from "./contracts/requested-texture";
import { IShader } from "./contracts/shader";
import TextureStorage from "./contracts/texture-storage";
import TextureOptions from "./contracts/texture/texture-opts";
import Texture3DOptions from "./contracts/texture/texture3d-opts";
import Mesh from "./mesh/mesh";
import Scene from "./scene";
import TextureCubemap from "./texture/texture-cubemap";
import Texture2D from "./texture/texture2d";
import Texture3D from "./texture/texture3d";

export default class ClientEngine<
    T extends Record<string, unknown[]> & ClientWorldEvents = ClientWorldEvents,
    WORLD extends ClientWorld = ClientWorld,
    EVENTS extends WorldModuleEvents & ClientWorldEvents = WorldModuleEvents & ClientWorldEvents
> extends Engine<T, WORLD, EVENTS> {
    protected graphicsModule: BaseGraphicsModule<ClientGraphicsModuleEvents> | null;
    private requestedTextures: Array<RequestedTexture>;
    protected textures: Array<TextureStorage>;
    protected prevTime: number;

    constructor(world: WORLD) {
        super(world);

        this._world.on("start", () => this.emit("start"));
        this._world.on("clientmapobject", (object) => this.emit("clientmapobject", object));
        this._world.on("clientmapobject", (object) => this.context.emitter.emit("clientmapobject", object));
        this._world.on("framestart", () => this.tick());
        this._world.on("frameend", () => this.endtick())
        this.graphicsModule = null;
        this.textures = [];
        this.requestedTextures = [];
        this.prevTime = 0;
    }

    get world() {
        return this._world;
    }

    registerShader(name: string, vertex: IShader, fragment: IShader): void {
        if(this.graphicsModule === null) {
            // TODO: Queue shaders
            throw new Error("Attempt to register a shader with graphics module unset.");
        }

        this.graphicsModule.registerShader(name, vertex, fragment);
    }

    registerMesh(mesh: Mesh): number {
        const result = this.context.emitter.emit("meshRegistered", mesh);

        if(result.length > 0) {
            return result[0];
        }

        return -1;
    }

    freeMesh(mesh: Mesh): void {
        this.context.emitter.emit("meshFreeRequest", mesh);
    }

    setGraphicsModule(module: BaseGraphicsModule<ClientGraphicsModuleEvents>, width: number, height: number): void {
        this.graphicsModule = module;
        this.graphicsModule.init({
            width,
            height,
            context: this.context
        });

        if(this.requestedTextures.length) {
            for(const texture of this.requestedTextures) {
                switch(texture.type) {
                    case "2d": {
                        this.registerTexture2D(texture.texture);
                        break;
                    }
                    case "3d": {
                        this.registerTexture3D(texture.texture);
                        break;
                    }
                    case "cubemap": {
                        this.registerTextureCubemap(texture.texture);
                        break;
                    }
                }
            }
        }
    }

    getGraphicsModule() {
        return this.graphicsModule;
    }

    runRenderLoop() {
        this._world.runTickLoop();
    }

    render(scene?: Scene) {
        this.tick();

        if(this.graphicsModule !== null) {
            this.graphicsModule.render(scene);
        }
    }

    registerTexture2D<T extends TextureOptions = TextureOptions>(texture: Texture2D<T>) {
        if(this.graphicsModule !== null) {
            const id = this.graphicsModule.createTexture2D<T>(texture);

            if(id !== -1) {
                this.textures.push({
                    id,
                    type: "2d",
                    texture
                });
            }
        } else {
            this.requestedTextures.push({
                type: "2d",
                texture
            });
        }
    }

    registerTexture3D<T extends Texture3DOptions = Texture3DOptions>(texture: Texture3D<T>) {
        if(this.graphicsModule !== null) {
            const id = this.graphicsModule.createTexture3D<T>(texture);

            if(id !== -1) {
                this.textures.push({
                    id,
                    type: "3d",
                    texture
                });
            }
        } else {
            this.requestedTextures.push({
                type: "3d",
                texture
            });
        }
    }

    registerTextureCubemap<T extends TextureOptions = TextureOptions>(texture: TextureCubemap<T>) {
        if(this.graphicsModule !== null) {
            const id = this.graphicsModule.createTextureCubemap<T>(texture);

            if(id !== -1) {
                this.textures.push({
                    id,
                    type: "cubemap",
                    texture
                });
            }
        } else {
            this.requestedTextures.push({
                type: "cubemap",
                texture
            });
        }
    }

    freeTexture(texture: Texture2D | Texture3D | TextureCubemap) {
        this.textures.forEach((textureItem, i) => {
            if(textureItem.texture === texture) {
                this.textures.splice(i, 1);
            }
        });
    }

    tick() {
        const time = this._world.getTime() / 1000;
        const timedelta = time - this.prevTime;

        // Update all textures
        if(this.graphicsModule) {
            for(const texture of this.textures) {
                switch(texture.type) {
                    case "2d": {
                        this.graphicsModule.updateTexture2D(texture.id, time, timedelta);
                        break;
                    }
                    case "3d": {
                        this.graphicsModule.updateTexture3D(texture.id, time, timedelta);
                        break;
                    }
                    case "cubemap": {
                        this.graphicsModule.updateTextureCubemap(texture.id, time, timedelta);
                        break;
                    }
                }
            }
        }

        this.prevTime = time;
    }

    endtick() {
        if(this.graphicsModule !== null) {
            this.graphicsModule.render();
        }
    }
}