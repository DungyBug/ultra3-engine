import { Texture2DStorage, Texture3DStorage, TextureCubemapStorage } from "./texture-storage";

// Used in ClientEngine
type RequestedTexture = Texture2DStorage | Texture3DStorage | TextureCubemapStorage;

export default RequestedTexture;