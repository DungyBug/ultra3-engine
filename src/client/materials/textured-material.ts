import BaseMaterial from "../base-material";
import Texture2D from "../texture/texture2d";
import { IShader } from "../contracts/shader";
import texturedVertexShaderSource from "../shaders/textured/vertex.glsl";
import texturedFragmentShaderSource from "../shaders/textured/fragment.glsl";
import ClientEngine from "../client-engine";

export default class TexturedMaterial extends BaseMaterial {
    public texture: Texture2D;

    constructor(engine: ClientEngine, texture: Texture2D) {
        super(engine);
        this.texture = texture;
        engine.registerShader("u3Textured", this.getVertexShader(), this.getFragmentShader());
    }

    get name(): string {
        return "u3Textured";
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
            params: [{
                name: "textureSampler",
                value: this.texture,
                type: "texture2D"
            }],
            name: "u3Textured",
            type: "fragment",
            source: texturedFragmentShaderSource
        }
    }
}