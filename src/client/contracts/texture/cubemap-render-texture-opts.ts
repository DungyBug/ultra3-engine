import OrthogonalCamera from "../../cameras/orthogonal-camera";
import PerspectiveCamera from "../../cameras/perspective-camera";
import SamplingMode from "../../constants/sampling-mode";
import TextureFormat from "../../constants/texture-format";

interface ICubemapRenderTextureOpts<T extends TextureFormat> {
    textureFormat: T;
    size: number;
    magSamplingMode: SamplingMode;
    minSamplingMode: SamplingMode;
    attachment: "color" | "depth" | "stencil";
    cameras?: [PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera, PerspectiveCamera]
            | [OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera, OrthogonalCamera]; // +x, -x, +y, -y, +z, -z
}

export default ICubemapRenderTextureOpts;