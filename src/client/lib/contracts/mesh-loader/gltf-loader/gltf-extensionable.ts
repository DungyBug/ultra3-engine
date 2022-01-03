/*
Base type for every GLTF node, except root node: GLTFStorage.
*/
interface IGLTFExtensionable {
    extensions?: {
        [k: `KHR_${string}`]: Record<string, any>;
    };
    extras?: any; // string | number | boolean | Array<string | number | boolean> | Record<string, any>
}

export default IGLTFExtensionable;