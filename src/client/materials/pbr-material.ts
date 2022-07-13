import { IKey } from "../../core/contracts/base/key";
import BaseMaterial from "../base-material";
import ClientEngine from "../client-engine";
import IPBRMaterialProps from "../contracts/materials/pbr-material";
import { IShader } from "../contracts/shader";
import ITexture2D from "../contracts/texture/texture2d";

export default class PBRMaterial extends BaseMaterial {
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

    constructor(engine: ClientEngine, params: IPBRMaterialProps) {
        super(engine);
        this.albedoTexture = params.albedoTexture;
        this.normalsTexture = params.normalsTexture;
        this.roughnessTexture = params.roughnessTexture;
        this.occlusionTexture = params.occlusionTexture;
        this.heightTexture = params.heightTexture;
        this.metallicTexture = params.metallicTexture;
        this.emissiveTexture = params.emissiveTexture;
        this.specularTexture = params.specularTexture;
        this.specularColor = params.specularColor;
        this.specularFactor = params.specularFactor || 0.0;
    }

    get name(): string {
        return "u3PBR";
    }

    getUniforms(): IKey[] {
        return [
            {
                name: "albedoSampler",
                value: this.albedoTexture,
                type: "texture2D"
            },
            {
                name: "normalsSampler",
                value: this.normalsTexture,
                type: "texture2D"
            },
            {
                name: "occlusionSampler",
                value: this.occlusionTexture,
                type: "texture2D"
            },
            {
                name: "heightSampler",
                value: this.heightTexture,
                type: "texture2D"
            },
            {
                name: "metallicSampler",
                value: this.metallicTexture,
                type: "texture2D"
            },
            {
                name: "emissiveSampler",
                value: this.emissiveTexture,
                type: "texture2D"
            }
        ];
    }

    getFragmentShader(): IShader {
        return {
            params: [
                {
                    name: "albedoSampler",
                    type: "texture2D"
                },
                {
                    name: "normalsSampler",
                    type: "texture2D"
                },
                {
                    name: "occlusionSampler",
                    type: "texture2D"
                },
                {
                    name: "heightSampler",
                    type: "texture2D"
                },
                {
                    name: "metallicSampler",
                    type: "texture2D"
                },
                {
                    name: "emissiveSampler",
                    type: "texture2D"
                }
            ],
            name: "u3PBRMaterial",
            type: "fragment",
            source: ""
        };
    }
}