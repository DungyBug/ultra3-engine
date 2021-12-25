import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFSkin extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    joints: Array<number>;
    inverseBindMatrices?: number;
    skeleton?: number;
}

export default IGLTFSkin;