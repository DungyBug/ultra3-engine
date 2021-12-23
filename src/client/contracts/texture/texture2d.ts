import TypedArray from "../common/typed-array";
import ITexture from "./texture";

interface ITexture2D<T extends TypedArray> extends ITexture<T> {
    get dimensions(): [number, number];
}

export default ITexture2D;