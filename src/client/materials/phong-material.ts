import BaseMaterial from "../base-material";
import Texture2D from "../texture/texture2d";
import { IShader } from "../contracts/shader";
import phongVertexShaderSource from "../shaders/phong/vertex.glsl";
import phongFragmentShaderSource from "../shaders/phong/fragment.glsl";
import ClientEngine from "../client-engine";
import { IKey } from "../../core/contracts/base/key";
import LightEntity from "../entities/light";

export default class PhongMaterial extends BaseMaterial {
    public texture: Texture2D;
    public shininess: number;
    public distribution: number;

    constructor(engine: ClientEngine, texture: Texture2D, shininess: number = 256, distribution: number = 0.2) {
        super(engine);
        this.texture = texture;
        this.shininess = shininess;
        this.distribution = distribution;
    }

    get name(): string {
        return "u3Phong";
    }

    getUniforms(): IKey[] {
        const pointLights: Array<LightEntity> = [];
        const spotLights: Array<LightEntity> = [];
        const camera = this.engine.getGraphicsModule().getActiveCamera();

        for(const entity of this.engine.world.entities) {
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
            },
            {
                name: "cameraPosition",
                type: "f3",
                value: new Float32Array([camera.position.x, camera.position.y, camera.position.z])
            },
            {
                name: "shininess",
                type: "f1",
                value: this.shininess
            },
            {
                name: "distribution",
                type: "f1",
                value: this.distribution
            }
        ]
    }

    getVertexShader(): IShader {
        return {
            params: [],
            name: "u3Phong",
            type: "vertex",
            source: phongVertexShaderSource
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
                },
                {
                    name: "cameraPosition",
                    type: "f3"
                },
                {
                    name: "shininess",
                    type: "f1"
                },
                {
                    name: "distribution",
                    type: "f1"
                }
            ],
            name: "u3Phong",
            type: "fragment",
            source: phongFragmentShaderSource
        }
    }
}