import TextureOptions from "./texture-opts";

type Texture3DOptions = TextureOptions & {
    width: number;
    height: number;
    depth: number;
}

export default Texture3DOptions;