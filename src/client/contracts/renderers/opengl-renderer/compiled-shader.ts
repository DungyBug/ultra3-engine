export interface IUniform {
    name: string;
    type: "texture2D" | "texture3D" | "i1" | "i2" | "i3" | "i4" | "f1" | "f2" | "f3" | "f4" | "mat2" | "mat3" | "mat4";
}

interface ICompiledShader {
    shader: WebGLShader;
    uniforms: Array<IUniform>;
}

export default interface ICompiledShaders {
    fragment: ICompiledShader;
    vertex: ICompiledShader;
    program: WebGLProgram;
}