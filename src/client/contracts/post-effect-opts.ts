import { IKeyType } from "../../core/contracts/base/key";
import TextureFormat from "../constants/texture-format";

export default interface IPostEffectOpts {
    name: string;
    vertexShader: string;
    fragmentShader: string;
    params: Array<IKeyType>;
    width?: number;
    height?: number;
    textureFormat?: TextureFormat;
}