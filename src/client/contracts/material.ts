import ComplexShader from "./complex-shader";
import { IShader } from "./shader";

interface IMaterial {
    getShader(): IShader | ComplexShader;
}

export default IMaterial;