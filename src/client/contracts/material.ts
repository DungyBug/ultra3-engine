import { IKey } from "../../core/contracts/base/key";
import Scene from "../scene";
import { IShader } from "./shader";

interface IMaterial {
    readonly name: string;
    getVertexShader(): IShader; // ComplexShader
    getFragmentShader(): IShader; // ComplexShader
    getUniforms(scene: Scene): Array<IKey>;
}

export default IMaterial;