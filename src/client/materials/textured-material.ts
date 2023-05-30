import BaseMaterial from "../base-material";
import Texture2D from "../texture/texture2d";
import { IShader } from "../contracts/shader";
import texturedVertexShaderSource from "../shaders/textured/vertex.glsl";
import texturedFragmentShaderSource from "../shaders/textured/fragment.glsl";
import ClientEngine from "../client-engine";
import { IKey } from "../../core/contracts/base/key";
import ITexturedMaterialProps from "../contracts/materials/textured-material-props";

export default class TexturedMaterial extends BaseMaterial {
    public texture: Texture2D;

    constructor(engine: ClientEngine, opts: ITexturedMaterialProps) {
        super(engine, opts);
        this.texture = opts.texture ?? Texture2D.blackTexture(engine);
        engine.registerShader("u3Textured", this.getVertexShader(), this.getFragmentShader());
    }

    get name(): string {
        return "u3Textured";
    }

    getUniforms(): IKey[] {
        return [
            {
                name: "textureSampler",
                value: this.texture,
                type: "texture2D"
            }
        ]
    }

    getVertexShader(): IShader {
        return {
            params: [],
            name: "u3Textured",
            type: "vertex",
            source: texturedVertexShaderSource
        }
    }

    getFragmentShader(): IShader {
        return {
            params: [
                {
                    name: "textureSampler",
                    type: "texture2D"
                }
            ],
            name: "u3Textured",
            type: "fragment",
            source: texturedFragmentShaderSource
        }
    }
}