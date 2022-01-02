import { IGLTFNodeExtesionPunctualLight } from "./gltf-punctual-light";

/*
Base type for every GLTF node, except root node: GLTFStorage.
*/
interface IGLTFExtensionable {
    extensions?: {
        [k: `KHR_${string}`]: Record<string, any>,
        KHR_lights_punctual?: IGLTFNodeExtesionPunctualLight
    };
    extras?: any; // string | number | boolean | Array<string | number | boolean> | Record<string, any>
}

export default IGLTFExtensionable;