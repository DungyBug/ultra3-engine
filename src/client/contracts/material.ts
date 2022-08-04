import { IKey } from "../../core/contracts/base/key";
import CullMode from "../constants/cull-mode";
import Scene from "../scene";
import { IShader } from "./shader";

interface IMaterial {
    cullMode: CullMode;
    readonly name: string;
    getVertexShader(): IShader; // ComplexShader
    getFragmentShader(): IShader; // ComplexShader
    getUniforms(scene: Scene): Array<IKey>;
}

export default IMaterial;