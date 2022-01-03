import TypedArray from "../common/typed-array";
import ITexture from "./texture";

interface ITexture3D<T extends TypedArray> extends ITexture<T> {
    offset: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];

    get dimensions(): [number, number, number];
}

export default ITexture3D;