import IMaterial from "./contracts/material";
import { IShader } from "./contracts/shader";
import basicVertexShaderSource from "./shaders/basic/vertex.glsl";
import basicFragmentShaderSource from "./shaders/basic/fragment.glsl";
import ClientEngine from "./client-engine";
import { IKey } from "../core/contracts/base/key";

export default abstract class BaseMaterial implements IMaterial {
    protected engine: ClientEngine;

    constructor(engine: ClientEngine) {
        this.engine = engine;
        this.engine.registerShader(this.name, this.getVertexShader(), this.getFragmentShader());
    }

    get name(): string {
        return "u3Basic";
    }
    
    getUniforms(): Array<IKey> {
        return [];
    }

    getVertexShader(): IShader {
        return {
            params: [],
            name: "u3Basic",
            type: "vertex",
            source: basicVertexShaderSource
        }
    }

    getFragmentShader(): IShader {
        return {
            params: [],
            name: "u3Basic",
            type: "fragment",
            source: basicFragmentShaderSource
        }
    }
}