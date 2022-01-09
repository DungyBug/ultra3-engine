import { ITexturePointer } from "../gltf-material";

interface IGLTFSpecularMaterial {
    specularFactor?: number;
    specularTexture?: ITexturePointer;
    specularColorFactor?: [number, number, number];
    specularColorTexture?: ITexturePointer;
}

export default IGLTFSpecularMaterial;