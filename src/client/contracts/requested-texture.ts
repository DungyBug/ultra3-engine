import { Texture2DStorage, Texture3DStorage } from "./texture-storage";

// Used in ClientEngine
type RequestedTexture = Texture2DStorage | Texture3DStorage;

export default RequestedTexture;