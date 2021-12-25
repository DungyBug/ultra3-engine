import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFAnimationSampler extends IGLTFExtensionable {
    [k: string]: any;
    input: number;
    interpolation?: "LINEAR" | "STEP" | "CUBICSPLINE"; // LINEAR is default
    output: number;
}

export default IGLTFAnimationSampler;