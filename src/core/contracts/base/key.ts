type UniformTypes = "texture2D" | "texture3D" | "i1" | "i2" | "i3" | "i4" | "f1" | "f2" | "f3" | "f4" | "mat2" | "mat3" | "mat4";

export interface IKey {
    name: string;
    value: any;
    type: UniformTypes;
}