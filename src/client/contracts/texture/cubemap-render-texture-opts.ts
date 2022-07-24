import BaseCamera from "../../camera";
import SamplingMode from "../../constants/sampling-mode";
import TextureFormat from "../../constants/texture-format";

interface ICubemapRenderTextureOpts<T extends TextureFormat> {
    textureFormat: T;
    size: number;
    magSamplingMode: SamplingMode;
    minSamplingMode: SamplingMode;
    attachment: "color" | "depth" | "stencil";
    cameras?: [BaseCamera, BaseCamera, BaseCamera, BaseCamera, BaseCamera, BaseCamera]; // +x, -x, +y, -y, +z, -z
}

export default ICubemapRenderTextureOpts;