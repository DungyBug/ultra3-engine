import GLTFDataType from "../../../constants/mesh-loader/gltf-loader/data-type";
import IGLTFExtensionable from "./gltf-extensionable";
import IGLTFSparseAccessor from "./gltf-sparse-accessor";

interface IGLTFBaseAccessor extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    bufferView: number;
    byteOffset?: number;
    componentType: GLTFDataType;
    count: number;
    normalized?: boolean;
    max?: Array<number>;
    min?: Array<number>;
    type: "SCALAR" | "VEC2" | "VEC3" | "VEC4" | "MAT2" | "MAT3" | "MAT4";
    sparse?: IGLTFSparseAccessor;
}

interface IGLTFScalarAccessor extends IGLTFBaseAccessor {
    max?: [number];
    min?: [number];
    type: "SCALAR";
}

interface IGLTFVec2Accessor extends IGLTFBaseAccessor {
    max?: [number, number];
    min?: [number, number];
    type: "VEC2";
}

interface IGLTFVec3Accessor extends IGLTFBaseAccessor {
    max?: [number, number, number];
    min?: [number, number, number];
    type: "VEC3";
}

interface IGLTFVec4Accessor extends IGLTFBaseAccessor {
    max?: [number, number, number, number];
    min?: [number, number, number, number];
    type: "VEC4";
}

interface IGLTFMat2Accessor extends IGLTFBaseAccessor {
    max?: [number, number, number, number];
    min?: [number, number, number, number];
    type: "MAT2";
}

interface IGLTFMat3Accessor extends IGLTFBaseAccessor {
    max?: [number, number, number, number, number, number, number, number, number];
    min?: [number, number, number, number, number, number, number, number, number];
    type: "MAT3";
}

interface IGLTFMat4Accessor extends IGLTFBaseAccessor {
    max?: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
    min?: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
    type: "MAT4";
}

type GLTFAccessor = IGLTFScalarAccessor | IGLTFVec2Accessor | IGLTFVec3Accessor | IGLTFVec4Accessor | IGLTFMat2Accessor | IGLTFMat3Accessor | IGLTFMat4Accessor;

export default GLTFAccessor;