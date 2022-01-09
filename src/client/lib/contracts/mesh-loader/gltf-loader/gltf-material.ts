import IGLTFSpecularMaterial from "./extensions/gltf-specular-material";
import IGLTFTextureTransformExtension from "./extensions/gltf-texture-transform";
import IGLTFExtensionable from "./gltf-extensionable";

export interface ITexturePointer extends IGLTFExtensionable {
    index: number;
    texCoord?: number;

    extensions?: {
        [k: `KHR_${string}`]: Record<string, any>;
        KHR_texture_transform?: IGLTFTextureTransformExtension;
    }
};

interface IAdditionalNormalTexturePointer extends ITexturePointer {
    [k: string]: any;
    scale?: number;
};

interface IAdditionalOcclusionTexturePointer extends ITexturePointer {
    [k: string]: any;
    strength?: number;
};

interface IPBRMetallicRoughness extends IGLTFExtensionable {
    [k: string]: any;
    baseColorFactor?: [number, number, number, number];
    baseColorTexture?: ITexturePointer;
    metallicFactor?: number;
    metallicTexture?: ITexturePointer;
    roughnessFactor?: number;
    roughnessTexture?: ITexturePointer;
    metallicRoughnessTexture?: ITexturePointer;
};

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

    extensions?: {
        [k: `KHR_${string}`]: Record<string, any>;
        KHR_materials_specular?: IGLTFSpecularMaterial;
    }
};

interface IGLTFOpaqueMaterial extends IBaseGLTFMaterial {
    alphaMode?: "OPAQUE";
};

interface IGLTFMaskMaterial extends IBaseGLTFMaterial {
    alphaMode?: "MASK";
    alphaCutoff?: number;
};

interface IGLTFBlendMaterial extends IBaseGLTFMaterial {
    alphaMode?: "BLEND";
};

type GLTFMaterial = IGLTFOpaqueMaterial | IGLTFMaskMaterial | IGLTFBlendMaterial;

export default GLTFMaterial;