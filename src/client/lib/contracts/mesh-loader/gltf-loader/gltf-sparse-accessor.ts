import IGLTFExtensionable from "./gltf-extensionable";
import IGLTFSparseAccessorIndice from "./gltf-sparse-accessor-indice";
import IGLTFSparseAccessorValue from "./gltf-sparse-accessor-value";

interface IGLTFSparseAccessor extends IGLTFExtensionable {
    [k: string]: any;
    count: number;
    indices: Array<IGLTFSparseAccessorIndice>;
    values: Array<IGLTFSparseAccessorValue>;
}

export default IGLTFSparseAccessor;