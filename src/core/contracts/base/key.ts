type UniformTypes = "texture2D" | "texture3D" | "textureCubemap" | "i1" | "i2" | "i3" | "i4" | "f1" | "f2" | "f3" | "f4" | "i1v" | "i2v" | "i3v" | "i4v" | "f1v" | "f2v" | "f3v" | "f4v" | "mat2" | "mat3" | "mat4";

export interface IKey {
    name: string;
    value: any;
    type: UniformTypes;
}

export interface IKeyType {
    name: string;
    type: UniformTypes;
}