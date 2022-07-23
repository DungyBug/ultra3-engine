import TextureCubemap from "../texture/texture-cubemap";
import Texture2D from "../texture/texture2d";
import Texture3D from "../texture/texture3d";

interface IdentifiedTextureStorage {
    id: number;
    type: "2d" | "3d" | "cubemap";
}

export interface Texture2DStorage {
    type: "2d";
    texture: Texture2D;
}

export interface Texture3DStorage {
    type: "3d";
    texture: Texture3D;
}

export interface TextureCubemapStorage {
    type: "cubemap";
    texture: TextureCubemap;
}

type TextureStorage = (Texture2DStorage | Texture3DStorage | TextureCubemapStorage) & IdentifiedTextureStorage;

export default TextureStorage;