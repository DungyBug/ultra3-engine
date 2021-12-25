import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFTexture extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    sampler?: number;
    source?: number;
}

export default IGLTFTexture;