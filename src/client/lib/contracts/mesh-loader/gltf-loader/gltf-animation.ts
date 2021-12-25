import IGLTFAnimationSampler from "./gltf-animation-sampler";
import IGLTFChannel from "./gltf-channel";
import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFAnimation extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    channels: Array<IGLTFChannel>;
    samplers: Array<IGLTFAnimationSampler>;
}

export default IGLTFAnimation;