import Engine from "../core/engine"
import ClientWorld from "./client-world";
import ClientWorldEvents from "./contracts/client-world-events";
import IMaterial from "./contracts/material";
import BaseGraphicsModule from "./contracts/modules/graphics-module";
import { IShader } from "./contracts/shader";
import TextureOptions from "./contracts/texture/texture-opts";
import Texture3DOptions from "./contracts/texture/texture3d-opts";
import Texture2D from "./texture/texture2d";
import Texture3D from "./texture/texture3d";

export default class ClientEngine<T extends Record<string, unknown[]> & ClientWorldEvents = ClientWorldEvents> extends Engine<T> {
    protected graphicsModule: BaseGraphicsModule | null;
    protected world: ClientWorld;
    private requestedTextures: Array<Texture2D | Texture3D>;
    protected textures: Array<{
        id: number;
        texture: Texture2D | Texture3D;
    }>;

    constructor(world: ClientWorld) {
        super(world);

        this.world.on("start", () => this.emit("start"));
        this.graphicsModule = null;
        this.textures = [];
        this.requestedTextures = [];
    }

    registerShader(name: string, vertex: IShader, fragment: IShader): void {
        this.graphicsModule.registerShader(name, vertex, fragment);
    }

    setGraphicsModule(module: BaseGraphicsModule, width: number, height: number, fov: number): void {
        this.graphicsModule = module;
        this.graphicsModule.init({
            width,
            height,
            fov,
            context: this.context
        });

        if(this.requestedTextures.length) {
            for(const texture of this.requestedTextures) {
                if(texture.dimensions.length === 2) {
                    this.registerTexture2D(texture as Texture2D);
                } else {
                    this.registerTexture3D(texture as Texture3D);
                }
            }
        }
    }

    runRenderLoop() {
        this.world.runTickLoop();
    }

    registerTexture2D<T extends TextureOptions = TextureOptions>(texture: Texture2D<T>) {
        if(this.graphicsModule !== null) {
            const id = this.graphicsModule.createTexture2D<T>(texture);

            if(id !== -1) {
                this.textures.push({
                    id,
                    texture
                });
            }
        } else {
            this.requestedTextures.push(texture);
        }
    }

    registerTexture3D<T extends Texture3DOptions = Texture3DOptions>(texture: Texture3D<T>) {
        if(this.graphicsModule === null) {
            const id = this.graphicsModule.createTexture3D<T>(texture);

            if(id !== -1) {
                this.textures.push({
                    id,
                    texture
                });
            }
        } else {
            this.requestedTextures.push(texture);
        }
    }

    freeTexture(texture: Texture2D | Texture3D) {
        for(let i = 0; i < this.textures.length; i++) {
            if(this.textures[i].texture === texture) {
                this.textures.splice(i, 1);
            }
        }
    }
}