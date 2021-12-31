import TypedArray from "../common/typed-array";
import TextureOptions from "./texture-opts";

type Texture2DOptions<T extends TextureOptions> = T & {
    width: number;
    height: number;
}

export default Texture2DOptions;