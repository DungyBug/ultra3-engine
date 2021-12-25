import GLTFDataType from "../../../constants/mesh-loader/gltf-loader/data-type";

interface IGLTFSparseAccessorIndice {
    [k: string]: any;
    bufferView: number;
    byteOffset?: number;
    componentType: GLTFDataType;
    extensions?: Record<string, any>;
    extras?: any; // string | number | boolean | Array<string | number | boolean> | Record<string, any>
}

export default IGLTFSparseAccessorIndice;