import IBaseMesh from "../base-mesh";
import TypedArray from "../common/typed-array";

interface IVolume extends IBaseMesh {
    getRawData(at: number): TypedArray;
}

export default IVolume;