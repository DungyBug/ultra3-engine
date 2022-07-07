import ComplexShader from "./complex-shader";
import { IShader } from "./shader";

interface IMaterial {
    readonly name: string;
    getVertexShader(): IShader; // ComplexShader
    getFragmentShader(): IShader; // ComplexShader
}

export default IMaterial;