import TypedArray from "../common/typed-array";
import ITexture2D from "../texture/texture2d";

interface IPBRMaterialProps {
    albedoTexture: ITexture2D<Uint8Array>;
    normalsTexture: ITexture2D<Uint8Array>;
    roughnessTexture: ITexture2D<Uint8Array>;
    occlusionTexture: ITexture2D<Uint8Array>;
    heightTexture: ITexture2D<Uint8Array>;
    metallicTexture: ITexture2D<Uint8Array>;
    emissiveTexture: ITexture2D<Uint8Array>;
    specularTexture: ITexture2D<Uint8Array>;
    specularColor: ITexture2D<Uint8Array>;
    specularFactor?: number;
};

export default IPBRMaterialProps;