import TextureOptions from "./texture-opts";

type Texture2DOptions<T extends TextureOptions> = T & {
    offset?: [number, number]; // default [0, 0]
    rotation?: [number]; // default [0]
    scale?: [number, number]; // default [1, 1]
    width: number;
    height: number;
}

export default Texture2DOptions;