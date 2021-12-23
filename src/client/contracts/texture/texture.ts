import ColorMode from "../../constants/color-mode";
import SamplingMode from "../../constants/sampling-mode";
import TypedArray from "../common/typed-array";

interface ITexture<T extends TypedArray> {
    /**
     * Gets texture at time ( for animated textures )
     * @param time - time in seconds
     */
    getRawData(time: number): T;

    /**
     * Returns texture size in dimensions.
     */
    get dimensions(): Array<number>;
    get samplingMode(): SamplingMode;
    get colorMode(): ColorMode;
};

export default ITexture;