import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFAsset extends IGLTFExtensionable {
    [k: string]: any;
    version: string;
    minVersion?: string;
    generator?: string;
    copyright?: string;
}

export default IGLTFAsset;