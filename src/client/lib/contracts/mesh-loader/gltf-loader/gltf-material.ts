import IGLTFExtensionable from "./gltf-extensionable";

interface ITexturePointer extends IGLTFExtensionable {
    index: number;
    texCoord?: number;
}

interface IAdditionalNormalTexturePointer extends ITexturePointer {
    [k: string]: any;
    scale?: number;
}

interface IAdditionalOcclusionTexturePointer extends ITexturePointer {
    [k: string]: any;
    strength?: number;
}

interface IPBRMetallicRoughness extends IGLTFExtensionable {
    [k: string]: any;
    baseColorFactor?: [number, number, number, number];
    baseColorTexture?: ITexturePointer;
    metallicFactor?: number;
    metallicTexture?: ITexturePointer;
    roughnessFactor?: number;
    roughnessTexture?: ITexturePointer;
    metallicRoughnessTexture?: ITexturePointer;
}

interface IBaseGLTFMaterial extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    pbrMetallicRoughness?: IPBRMetallicRoughness;
    normalTexture?: IAdditionalNormalTexturePointer;
    occlusionTexture?: IAdditionalOcclusionTexturePointer;
    emissiveTexture?: ITexturePointer;
    emissiveFactor?: number;
    alphaMode?: "OPAQUE" | "MASK" | "BLEND";
    doubleSided?: boolean;
}

interface IGLTFOpaqueMaterial {
    alphaMode?: "OPAQUE";
}

interface IGLTFMaskMaterial {
    alphaMode?: "MASK";
    alphaCutoff?: number;
}

interface IGLTFBlendMaterial {
    alphaMode?: "BLEND";
}

type GLTFMaterial = IBaseGLTFMaterial | (IGLTFOpaqueMaterial | IGLTFMaskMaterial | IGLTFBlendMaterial);

export default GLTFMaterial;