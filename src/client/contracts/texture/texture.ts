import ColorMode from "../../constants/color-mode";
import SamplingMode from "../../constants/sampling-mode";
import TypedArray from "../common/typed-array";

interface ITexture<T extends TypedArray> {
    offset: Array<number>;
    rotation: Array<number>;
    scale: Array<number>;

    /**
     * Gets texture at time ( for animated textures )
     * @param time - time in seconds
     */
    getRawData(time: number): T;

    /**
     * Frees texture from memory
     */
    free(): void;

    /**
     * Returns texture size in dimensions.
     */
    get dimensions(): Array<number>;
    get magSamplingMode(): SamplingMode;
    get minSamplingMode(): SamplingMode;
    get colorMode(): ColorMode;
};

export default ITexture;