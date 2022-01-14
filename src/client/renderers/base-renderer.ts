import { IKey } from "../../core/contracts/base/key";
import ComplexShaderMixMode from "../constants/complex-shader-mix-mode";
import ComplexShader from "../contracts/complex-shader";
import IMesh from "../contracts/mesh";
import IRenderer from "../contracts/renderer/renderer";
import { IComplexRendererShader, IMixShader, IRendererShader } from "../contracts/renderer/renderer-shader";

class BaseRenderer implements IRenderer {
    protected canvas: HTMLCanvasElement;
    protected shaders: Record<string, IRendererShader & Record<string, any>>;
    protected meshes: Array<IMesh>;
    protected mixShaders: Record<string, IMixShader>;

    constructor(canvas?: HTMLCanvasElement) {
        if(canvas) {
            this.canvas = canvas;
        }

        this.shaders = {};
        this.meshes = [];
        this.mixShaders = {};
    }

    setupShader(shader: IRendererShader) {
        this.shaders[shader.name] = shader;
    }

    setupComplexShader(shader: ComplexShader) {
        const simpleShader = this.compileComplexShader(shader);
        
    }

    setupMixShader(shader: IMixShader) {
        this.mixShaders[shader.name] = shader;
    }

    compileComplexShader(complexShader: ComplexShader): IComplexRendererShader {
        let output: IComplexRendererShader;
        let source: string = '';
        let entries: Array<string> = [];
        let params: Array<IKey> = [];
        let complexShaderCount = 0;

        for(let shader of complexShader.shaders) {
            if(shader.type === "complex") {
                let complex = this.compileComplexShader(shader);

                params = [...params, ...complex.params];
                source += '\n\n';
                source += complex.source;
                entries = entries.concat(complex.entries);
                complexShaderCount += complex.entries.length;
            } else {
                source += '\n\n';
                source += this.shaders[shader.name].source;
                entries.push(shader.entryPoint || shader.name);
            }
        }

        source += "\n\n";

        switch(complexShader.mixMode) {
            case ComplexShaderMixMode.ADD: {
                source +=
                `vec4 __complexshader${complexShaderCount}() {\n\r`+
                "\tvec4 color = vec4(0.0);\n\r";

                for(let entry of entries) {
                    source += `\tcolor += ${entry}();\n\r`;
                }

                source +=
                "\tcolor.w = clamp(color.w, 0.0, 1.0);\n\r"+
                "\treturn color;\n\r"+
                "}\n\r";
                break;
            }
            case ComplexShaderMixMode.SUBTRACT: {
                source +=
                `vec4 __complexshader${complexShaderCount}() {\n\r`+
                `\tvec4 color = ${entries[0]}();\n\r`;

                for(let i = 1; i < entries.length; i++) {
                    source += `\tcolor -= ${entries[i]}();\n\r`;
                }

                source +=
                "\tcolor.w = clamp(color.w, 0.0, 1.0);\n\r"+
                "\treturn color;\n\r"+
                "}\n\r";
                break;
            }
            case ComplexShaderMixMode.MULTIPLY: {
                source +=
                `vec4 __complexshader${complexShaderCount}() {\n\r`+
                "\tvec4 color = vec4(1.0);\n\r";

                for(let entry of entries) {
                    source += `\tcolor *= ${entry}();\n\r`;
                }

                source +=
                "\tcolor.w = clamp(color.w, 0.0, 1.0);\n\r"+
                "\treturn color;\n\r"+
                "}\n\r";
                break;
            }
            case ComplexShaderMixMode.CUSTOM: {
                source +=
                `vec4 __complexshader${complexShaderCount}() {\n\r`+
                `\treturn ${complexShader.mixShader}(${entries.join('(),')}());\n\r`+
                "}\n\r";
                break;
            }
        }

        output = {
            source,
            entries: [`__complexshader${complexShaderCount}`],
            params: params,
            name: "asdf"
        }

        return output;
    }

    addMesh(mesh: IMesh) {
        this.meshes.push(mesh);
    }

    deleteMesh(mesh: IMesh) {
        this.meshes.splice(this.meshes.indexOf(mesh));
    }

    resizeCanvas(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    
    setupScreenPostEffect(frag: string, uniforms?: IKey[]): 0 | -1 { return -1 }
    render() {}
}

export default BaseRenderer;