/**
 * FreeTexturedMaterial
 * Textured material, without any shading. This material doesn't use uvs to "fix" textures on their "points", like skybox.
 * Used in portals.
 */

import BaseMaterial from "../base-material";
import Texture2D from "../texture/texture2d";
import { IShader } from "../contracts/shader";
import freeTexturedVertexShaderSource from "../shaders/free-textured/vertex.glsl";
import freeTexturedFragmentShaderSource from "../shaders/free-textured/fragment.glsl";
import ClientEngine from "../client-engine";
import { IKey } from "../../core/contracts/base/key";
import BaseGraphicsModule from "../contracts/modules/graphics-module";
import ITexturedMaterialProps from "../contracts/materials/textured-material-props";

export default class FreeTexturedMaterial extends BaseMaterial {
    public texture: Texture2D;
    protected engine: ClientEngine;
    protected module: BaseGraphicsModule;

    constructor(engine: ClientEngine, opts: ITexturedMaterialProps) {
        super(engine, opts);
        this.texture = opts.texture;
        this.engine = engine;
        this.module = this.engine.getGraphicsModule();
        this.engine.registerShader("u3FreeTextured", this.getVertexShader(), this.getFragmentShader());
    }

    get name(): string {
        return "u3FreeTextured";
    }

    getUniforms(): IKey[] {
        return [
            {
                name: "textureSampler",
                value: this.texture,
                type: "texture2D"
            },
            {
                name: "screenSize",
                value: new Float32Array([this.module.width, this.module.height]),
                type: "f2"
            }
        ]
    }

    getVertexShader(): IShader {
        return {
            params: [],
            name: "u3FreeTextured",
            type: "vertex",
            source: freeTexturedVertexShaderSource
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
                    name: "screenSize",
                    type: "f2"
                }
            ],
            name: "u3FreeTextured",
            type: "fragment",
            source: freeTexturedFragmentShaderSource
        }
    }
}