import Texture2D from "../texture/texture2d";
import Texture3D from "../texture/texture3d";

interface IdentifiedTextureStorage {
    id: number;
    type: "2d" | "3d";
}

export interface Texture2DStorage {
    type: "2d";
    texture: Texture2D;
}

export interface Texture3DStorage {
    type: "3d";
    texture: Texture3D;
}

type TextureStorage = (Texture2DStorage | Texture3DStorage) & IdentifiedTextureStorage;

export default TextureStorage;