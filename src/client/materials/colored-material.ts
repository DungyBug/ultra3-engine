import BaseMaterial from "../base-material";
import { IShader } from "../contracts/shader";
import coloredVertexShaderSource from "../shaders/colored/vertex.glsl";
import coloredFragmentShaderSource from "../shaders/colored/fragment.glsl";
import ClientEngine from "../client-engine";
import { IKey } from "../../core/contracts/base/key";

export default class ColoredMaterial extends BaseMaterial {
    public color: [number, number, number];

    constructor(engine: ClientEngine, color: [number, number, number]) {
        super(engine);
        this.color = color;
        engine.registerShader("u3Colored", this.getVertexShader(), this.getFragmentShader());
    }

    get name(): string {
        return "u3Colored";
    }

    getUniforms(): IKey[] {
        return [
            {
                name: "color",
                value: new Float32Array(this.color),
                type: "f3"
            }
        ]
    }

    getVertexShader(): IShader {
        return {
            params: [],
            name: "u3Colored",
            type: "vertex",
            source: coloredVertexShaderSource
        }
    }

    getFragmentShader(): IShader {
        return {
            params: [
                {
                    name: "color",
                    type: "f3"
                }
            ],
            name: "u3Colored",
            type: "fragment",
            source: coloredFragmentShaderSource
        }
    }
}