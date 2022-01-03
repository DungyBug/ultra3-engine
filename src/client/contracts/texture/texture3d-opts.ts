import TextureOptions from "./texture-opts";

type Texture3DOptions = TextureOptions & {
    offset?: [number, number, number]; // default [0, 0, 0]
    rotation?: [number, number, number]; // default [0, 0, 0]
    scale?: [number, number, number]; // default [1, 1, 1]
    width: number;
    height: number;
    depth: number;
}

export default Texture3DOptions;