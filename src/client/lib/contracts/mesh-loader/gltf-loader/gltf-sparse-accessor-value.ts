interface IGLTFSparseAccessorValue {
    [k: string]: any;
    bufferView: number;
    byteOffset?: number;
    extensions?: Record<string, any>;
    extras?: any; // string | number | boolean | Array<string | number | boolean> | Record<string, any>
}

export default IGLTFSparseAccessorValue;