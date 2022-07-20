import BaseModuleContext from "../core/contracts/module-context";
import WorldModuleEvents from "../core/contracts/world-module-events";
import Engine from "../core/engine"
import ClientWorld from "./client-world";
import ClientWorldEvents from "./contracts/client-world-events";
import ClientGraphicsModuleEvents from "./contracts/modules/client-graphics-module-events";
import BaseGraphicsModule from "./contracts/modules/graphics-module";
import RequestedTexture from "./contracts/requested-texture";
import { IShader } from "./contracts/shader";
import TextureStorage from "./contracts/texture-storage";
import TextureOptions from "./contracts/texture/texture-opts";
import Texture3DOptions from "./contracts/texture/texture3d-opts";
import Texture2D from "./texture/texture2d";
import Texture3D from "./texture/texture3d";

export default class ClientEngine<T extends Record<string, unknown[]> & ClientWorldEvents = ClientWorldEvents> extends Engine<T> {
    protected graphicsModule: BaseGraphicsModule<ClientGraphicsModuleEvents> | null;
    protected _world: ClientWorld;
    private requestedTextures: Array<RequestedTexture>;
    protected context: BaseModuleContext<WorldModuleEvents & ClientWorldEvents>;
    protected textures: Array<TextureStorage>;
    protected prevTime: number;

    constructor(world: ClientWorld) {
        super(world);

        this._world.on("start", () => this.emit("start"));
        this._world.on("clientmapobject", (object) => this.emit("clientmapobject", object));
        this._world.on("clientmapobject", (object) =>  this.context.emitter.emit("clientmapobject", object));
        this._world.on("framestart", () => this.tick());
        this.graphicsModule = null;
        this.textures = [];
        this.requestedTextures = [];
        this.prevTime = 0;
    }

    registerShader(name: string, vertex: IShader, fragment: IShader): void {
        this.graphicsModule.registerShader(name, vertex, fragment);
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
        if(this.graphicsModule === null) {
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

    freeTexture(texture: Texture2D | Texture3D) {
        for(let i = 0; i < this.textures.length; i++) {
            if(this.textures[i].texture === texture) {
                this.textures.splice(i, 1);
            }
        }
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
                }
            }
        }

        this.prevTime = time;
    }
}