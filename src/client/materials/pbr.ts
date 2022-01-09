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
    specularTexture: ITexture2D<Uint8Array>;
    specularColor: ITexture2D<Uint8Array>;
    specularFactor: number;

    constructor(params: IPBRMaterialProps) {
        this.albedoTexture = params.albedoTexture;
        this.normalsTexture = params.normalsTexture || ColorTexture.White();
        this.roughnessTexture = params.roughnessTexture || ColorTexture.White();
        this.occlusionTexture = params.occlusionTexture || ColorTexture.White();
        this.heightTexture = params.heightTexture || ColorTexture.Black();
        this.metallicTexture = params.metallicTexture || ColorTexture.Black();
        this.emissiveTexture = params.emissiveTexture || ColorTexture.Black();
        this.specularTexture = params.specularTexture || ColorTexture.White();
        this.specularColor = params.specularColor || ColorTexture.White();
        this.specularFactor = params.specularFactor || 0.0;
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