import IMaterial from "../contracts/material";
import IPBRMaterialProps from "../contracts/materials/pbr-material";
import { IShader } from "../contracts/shader";
import ITexture2D from "../contracts/texture/texture2d";
import ColorTexture from "../texture/color";

class PBRMaterial implements IMaterial {
    albedoTexture: ITexture2D<Uint8Array>;
    normalsTexture: ITexture2D<Uint8Array>;
    roughnessTexture: ITexture2D<Uint8Array>;
    occlusionTexture: ITexture2D<Uint8Array>;
    heightTexture: ITexture2D<Uint8Array>;
    metallicTexture: ITexture2D<Uint8Array>;
    emissiveTexture: ITexture2D<Uint8Array>;

    constructor(params: IPBRMaterialProps) {
        this.albedoTexture = params.albedoTexture;
        this.normalsTexture = params.normalsTexture || ColorTexture.White();
        this.roughnessTexture = params.roughnessTexture || ColorTexture.White();
        this.occlusionTexture = params.occlusionTexture || ColorTexture.White();
        this.heightTexture = params.heightTexture || ColorTexture.Black();
        this.metallicTexture = params.metallicTexture || ColorTexture.Black();
        this.emissiveTexture = params.emissiveTexture || ColorTexture.Black();
    }

    getShader(): IShader {
        return {
            params: [
                {
                    name: "albedoSampler",
                    value: this.albedoTexture
                },
                {
                    name: "normalsSampler",
                    value: this.normalsTexture
                },
                {
                    name: "occlusionSampler",
                    value: this.occlusionTexture
                },
                {
                    name: "heightSampler",
                    value: this.heightTexture
                },
                {
                    name: "metallicSampler",
                    value: this.metallicTexture
                },
                {
                    name: "emissiveSampler",
                    value: this.emissiveTexture
                }
            ],
            name: "U3PBRMaterial"
        }
    }
}

export default PBRMaterial;