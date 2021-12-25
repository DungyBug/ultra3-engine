import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFChannelTarget extends IGLTFExtensionable {
    [k: string]: any;
    node?: number; // Specification says, that it should be there, but if it undefined, just ignore the channel
    path: "translation" | "rotation" | "scale" | "weights";
}

interface IGLTFChannel extends IGLTFExtensionable {
    [k: string]: any;
    sampler: number;
    target: IGLTFChannelTarget;
}

export default IGLTFChannel;