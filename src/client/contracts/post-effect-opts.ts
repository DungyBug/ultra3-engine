import { IKeyType } from "../../core/contracts/base/key";
import SamplingMode from "../constants/sampling-mode";
import TextureFormat from "../constants/texture-format";

export default interface IPostEffectOpts {
    name: string;
    vertexShader: string;
    fragmentShader: string;
    params: Array<IKeyType>;
    width?: number;
    height?: number;
    samplingMode?: SamplingMode;
    textureFormat?: TextureFormat;
}