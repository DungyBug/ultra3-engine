import BaseMaterial from "../base-material";
import { IShader } from "../contracts/shader";
import reflectiveVertexShaderSource from "../shaders/reflective/vertex.glsl";
import reflectiveFragmentShaderSource from "../shaders/reflective/fragment.glsl";
import ClientEngine from "../client-engine";
import { IKey } from "../../core/contracts/base/key";
import TextureCubemap from "../texture/texture-cubemap";
import IReflectiveMaterialProps from "../contracts/materials/reflective-material-props";

export default class ReflectiveMaterial extends BaseMaterial {
    public texture: TextureCubemap;

    constructor(engine: ClientEngine, opts: IReflectiveMaterialProps) {
        super(engine, opts);
        this.texture = opts.texture;
        engine.registerShader("u3Reflective", this.getVertexShader(), this.getFragmentShader());
    }

    get name(): string {
        return "u3Reflective";
    }

    getUniforms(): IKey[] {
        const graphicsModule = this.engine.getGraphicsModule();

        if(!graphicsModule) {
            throw new Error("Unable to get uniforms: setup graphics module first.");
        }

        const cameraPosition = graphicsModule.getActiveCamera().getPosition();

        return [
            {
                name: "textureSampler",
                value: this.texture,
                type: "textureCubemap"
            },
            {
                name: "cameraPosition",
                value: new Float32Array([cameraPosition.x, cameraPosition.y, cameraPosition.z]),
                type: "f3"
            }
        ]
    }

    getVertexShader(): IShader {
        return {
            params: [],
            name: "u3Reflective",
            type: "vertex",
            source: reflectiveVertexShaderSource
        }
    }

    getFragmentShader(): IShader {
        return {
            params: [
                {
                    name: "textureSampler",
                    type: "textureCubemap"
                },
                {
                    name: "cameraPosition",
                    type: "f3"
                }
            ],
            name: "u3Reflective",
            type: "fragment",
            source: reflectiveFragmentShaderSource
        }
    }
}