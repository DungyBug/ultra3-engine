import { IKey } from "../../core/contracts/base/key";
import { IShader } from "./shader";

interface IMaterial {
    readonly name: string;
    getVertexShader(): IShader; // ComplexShader
    getFragmentShader(): IShader; // ComplexShader
    getUniforms(): Array<IKey>;
}

export default IMaterial;