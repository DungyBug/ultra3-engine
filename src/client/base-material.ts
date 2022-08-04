import IMaterial from "./contracts/material";
import { IShader } from "./contracts/shader";
import basicVertexShaderSource from "./shaders/basic/vertex.glsl";
import basicFragmentShaderSource from "./shaders/basic/fragment.glsl";
import ClientEngine from "./client-engine";
import { IKey } from "../core/contracts/base/key";
import Scene from "./scene";
import CullMode from "./constants/cull-mode";
import IBaseMaterialProps from "./contracts/materials/base-material-props";

export default abstract class BaseMaterial implements IMaterial {
    public cullMode: CullMode;
    protected engine: ClientEngine;
    protected registered: boolean;

    constructor(engine: ClientEngine, opts: IBaseMaterialProps = {}, register: boolean = true) {
        this.engine = engine;
        this.cullMode = opts.cullMode || CullMode.NONE;

        this.registered = register;
        if(register) {
            this.engine.registerShader(this.name, this.getVertexShader(), this.getFragmentShader());
        }
    }

    get name(): string {
        return "u3Basic";
    }

    register() {
        if(this.registered) {
            return;
        }

        this.registered = true;
        this.engine.registerShader(this.name, this.getVertexShader(), this.getFragmentShader());
    }
    
    getUniforms(scene: Scene): Array<IKey> {
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