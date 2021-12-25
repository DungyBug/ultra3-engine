import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFScene extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    nodes?: Array<number>;
}

export default IGLTFScene;