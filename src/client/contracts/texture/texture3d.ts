import TypedArray from "../common/typed-array";
import ITexture from "./texture";

interface ITexture3D<T extends TypedArray> extends ITexture<T> {
    get dimensions(): [number, number, number];
}

export default ITexture3D;