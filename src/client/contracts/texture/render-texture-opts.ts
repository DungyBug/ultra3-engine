import BaseCamera from "../../camera";
import SamplingMode from "../../constants/sampling-mode";
import TextureFormat from "../../constants/texture-format";

interface IRenderTextureOpts<T extends TextureFormat> {
    textureFormat: T;
    width: number;
    height: number;
    magSamplingMode: SamplingMode;
    minSamplingMode: SamplingMode;
    attachment: "color" | "depth" | "stencil";
    camera?: BaseCamera;
}

export default IRenderTextureOpts;