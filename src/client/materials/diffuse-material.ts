import BaseMaterial from "../base-material";
import Texture2D from "../texture/texture2d";
import { IShader } from "../contracts/shader";
import diffuseVertexShaderSource from "../shaders/diffuse/vertex.glsl";
import diffuseFragmentShaderSource from "../shaders/diffuse/fragment.glsl";
import ClientEngine from "../client-engine";
import { IKey } from "../../core/contracts/base/key";
import LightEntity from "../entities/light";
import Scene from "../scene";

export default class DiffuseMaterial extends BaseMaterial {
    public texture: Texture2D;

    constructor(engine: ClientEngine, texture: Texture2D) {
        super(engine);
        this.texture = texture;
    }

    get name(): string {
        return "u3Diffuse";
    }

    getUniforms(scene: Scene): IKey[] {
        const pointLights: Array<LightEntity> = [];
        const spotLights: Array<LightEntity> = [];

        for(const entity of scene.entities) {
            if(entity instanceof LightEntity) {
                switch(entity.type) {
                    case "point": {
                        pointLights.push(entity);
                        break;
                    }
                    case "spot": {
                        spotLights.push(entity);
                        break;
                    }
                }
            }
        }

        return [
            {
                name: "textureSampler",
                value: this.texture,
                type: "texture2D"
            },
            {
                name: "pointLightPositions",
                type: "f3v",
                value: new Float32Array(pointLights.reduce((array, light) => array.concat([light.pos.x, light.pos.y, light.pos.z]), []))
            },
            {
                name: "pointLightColors",
                type: "f4v",
                value: new Float32Array(pointLights.reduce((array, light) => array.concat(light.color.concat([light.itensity])), []))
            },
            {
                name: "pointLightsCount",
                type: "i1",
                value: pointLights.length
            },
            {
                name: "spotLightPositions",
                type: "f3v",
                value: new Float32Array(spotLights.reduce((array, light) => array.concat([light.pos.x, light.pos.y, light.pos.z]), []))
            },
            {
                name: "spotLightColors",
                type: "f4v",
                value: new Float32Array(spotLights.reduce((array, light) => array.concat(light.color.concat([light.itensity])), []))
            },
            {
                name: "spotLightAngles",
                type: "f2v",
                value: new Float32Array(spotLights.reduce((array, light) => array.concat([light.outerAngle, light.innerAngle]), []))
            },
            {
                name: "spotLightDirections",
                type: "f3v",
                value: new Float32Array(spotLights.reduce((array, light) => array.concat([light.direction.x, light.direction.y, light.direction.z]), []))
            },
            {
                name: "spotLightsCount",
                type: "i1",
                value: spotLights.length
            }
        ]
    }

    getVertexShader(): IShader {
        return {
            params: [],
            name: "u3Diffuse",
            type: "vertex",
            source: diffuseVertexShaderSource
        }
    }

    getFragmentShader(): IShader {
        return {
            params: [
                {
                    name: "textureSampler",
                    type: "texture2D"
                },
                {
                    name: "pointLightPositions",
                    type: "f3v"
                },
                {
                    name: "pointLightColors",
                    type: "f4v"
                },
                {
                    name: "pointLightsCount",
                    type: "i1"
                },
                {
                    name: "spotLightPositions",
                    type: "f3v"
                },
                {
                    name: "spotLightColors",
                    type: "f4v"
                },
                {
                    name: "spotLightAngles",
                    type: "f2v"
                },
                {
                    name: "spotLightDirections",
                    type: "f3v"
                },
                {
                    name: "spotLightsCount",
                    type: "i1"
                }
            ],
            name: "u3Diffuse",
            type: "fragment",
            source: diffuseFragmentShaderSource
        }
    }
}