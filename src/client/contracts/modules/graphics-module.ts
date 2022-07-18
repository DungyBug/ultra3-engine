import { Entity } from "../../../core/entity";
import { MapObject } from "../../../core/map-object";
import BaseModule, { BaseModuleEvents } from "../../../core/contracts/module";
import BaseModuleContext from "../../../core/contracts/module-context";
import IGraphicsParameters from "./graphics-parameters";
import Texture2D from "../../texture/texture2d";
import Texture3D from "../../texture/texture3d";
import TextureOptions from "../texture/texture-opts";
import Texture3DOptions from "../texture/texture3d-opts";
import { IShader } from "../shader";
import BaseCamera from "../../camera";

export type BaseGraphicsModuleEvents = {
    newEntity: [Entity];
    entityDelete: [Entity];
    newObject: [MapObject];
} & BaseModuleEvents;

export default abstract class BaseGraphicsModule<T extends Record<string, any[]> = {}> extends BaseModule<T & BaseGraphicsModuleEvents> {
    init(parameters: IGraphicsParameters & {context: BaseModuleContext<T & BaseModuleEvents>}): void {
        this.context = parameters.context;
    }

    abstract setActiveCamera(camera: BaseCamera): void;

    abstract registerShader(name: string, vertex: IShader, fragment: IShader): void;

    /**
     * Get texture ready for further using
     * @param texture - texture to register
     * @returns id of texture ( that id is used in operations with that texture to identify texture ); -1 means that *texture can't be created*
     */
    abstract createTexture2D<T extends TextureOptions = TextureOptions>(texture: Texture2D<T>): number;

    /**
     * Updates current texture buffer ( needed for animation )
     * @param textureId - texture id for which to update buffer
     * @param time - time in seconds
     * @param timedelta - time delta between this and last frame ( in seconds )
     */
    abstract updateTexture2D(textureId: number, time: number, timedelta: number): void;
    
    /**
     * Get texture ready for further using
     * @param texture - texture to register
     * @returns id of texture ( that id is used in operations with that texture to identify texture ); -1 means that *texture can't be created*
     */
    abstract createTexture3D<T extends Texture3DOptions = Texture3DOptions>(texture: Texture3D<T>): number;

    /**
     * Updates current texture buffer ( needed for animation )
     * @param textureId - texture id for which to update buffer
     * @param time - time in seconds
     * @param timedelta - time delta between this and last frame ( in seconds )
     */
    abstract updateTexture3D(textureId: number, time: number, timedelta: number): void;

    /**
     * Free texture from memory
     * @param textureId - texture id to free
     */
    abstract freeTexture(textureId: number): void;
}