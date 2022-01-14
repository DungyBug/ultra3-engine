/*
Complex Shader is a shader, which consists of simple shaders and mixes all simple shaders.
For example: complex shader, which consists of Phong and Fresnel shaders mixed by "ComplexShaderMixMode.MULTIPLY"

Complex shader should consist only of "modular" shaders. This means that shader shouldn't have "main" function.
The "main" function is defined entry point ( name of shader by default ). Example for "u3phong" shader:
vec4 u3phong() { // NOT MAIN
    ...
}

Example of Phong and Fresnel complex shader output code:
attribute vec4 position;
attribute vec3 normal;
attribute vec2 uv;

... uniforms ...

vec4 u3phong() {
    ...
}

vec4 u3fresnel() {
    ...
}

void main() {
    vec4 output = vec4(0.0);
    output += u3phong();
    output += u3fresnel();
    output.w = min(output.w, 1.0);
    gl_FragColor = output;
}
*/

import ComplexShaderMixMode from "../constants/complex-shader-mix-mode";
import { IShader } from "./shader";

interface IBaseComplexShader {
    type: "complex";
    mixMode: ComplexShaderMixMode;
};

interface IStandardComplexShader extends IBaseComplexShader {
    mixMode: ComplexShaderMixMode.ADD | ComplexShaderMixMode.MULTIPLY | ComplexShaderMixMode.SUBTRACT;
}

interface ICustomMixinComplexShader extends IBaseComplexShader {
    mixMode: ComplexShaderMixMode.CUSTOM;
    mixShader: string;
}

type ComplexShader = (IStandardComplexShader | ICustomMixinComplexShader) & {
    shaders: Array<IShader | ComplexShader>;
};

export default ComplexShader;