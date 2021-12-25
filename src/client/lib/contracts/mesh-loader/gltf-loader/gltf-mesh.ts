import IGLTFExtensionable from "./gltf-extensionable";
import { IGLTFPrimitive } from "./gltf-types";

interface IGLTFMesh extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    primitives: Array<IGLTFPrimitive>;
    weights?: Array<number>;
}

export default IGLTFMesh;