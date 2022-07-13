import BaseMaterial from "../base-material";
import Texture2D from "../texture/texture2d";
import { IShader } from "../contracts/shader";
import diffuseVertexShaderSource from "../shaders/diffuse/vertex.glsl";
import diffuseFragmentShaderSource from "../shaders/diffuse/fragment.glsl";
import ClientEngine from "../client-engine";
import { IKey } from "../../core/contracts/base/key";
import LightEntity from "../entities/light";

export default class DiffuseMaterial extends BaseMaterial {
    public texture: Texture2D;

    constructor(engine: ClientEngine, texture: Texture2D) {
        super(engine);
        this.texture = texture;
    }

    get name(): string {
        return "u3Diffuse";
    }

    getUniforms(): IKey[] {
        const lights: Array<LightEntity> = [];

        for(const entity of this.engine.world.entities) {
            if(entity instanceof LightEntity) {
                lights.push(entity);
            }
        }

        return [
            {
                name: "textureSampler",
                value: this.texture,
                type: "texture2D"
            },
            {
                name: "lights",
                type: "f3v",
                value: lights.reduce((array, light) => array.concat([light.pos.x, light.pos.y, light.pos.z]), [])
            },
            {
                name: "lightColors",
                type: "f4v",
                value: lights.reduce((array, light) => array.concat(light.color.concat([light.itensity])), [])
            },
            {
                name: "lightsCount",
                type: "i1",
                value: lights.length
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
                    name: "lights",
                    type: "f3v"
                },
                {
                    name: "lightColors",
                    type: "f4v"
                },
                {
                    name: "lightsCount",
                    type: "i1"
                }
            ],
            name: "u3Diffuse",
            type: "fragment",
            source: diffuseFragmentShaderSource
        }
    }
}