import { IKey } from "../../../core/contracts/base/key";
import ComplexShader from "../complex-shader";
import IMesh from "../mesh";
import { IRendererShader } from "./renderer-shader";

interface IRenderer {
    setupShader(shader: IRendererShader): void;
    setupComplexShader(shader: ComplexShader): void;

    addMesh(mesh: IMesh): void;
    deleteMesh(mesh: IMesh): void;

    setupScreenPostEffect(frag: string, uniforms?: Array<IKey>): 0 | -1; // 0 - ok, -1 - error

    render(): void;
    runRenderLoop(): void;
    resizeCanvas(width: number, height: number): void;
}

export default IRenderer;
