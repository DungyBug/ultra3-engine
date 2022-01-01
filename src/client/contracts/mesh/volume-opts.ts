import { IVector } from "../../../core/contracts/base/vector";
import TypedArray from "../common/typed-array";
import ITexture3D from "../texture/texture3d";

interface IVolumeOptions {
    pos?: IVector; // 0, 0, 0 by default
    rotation?: IVector; // 0, 0, 0, by default
    scale?: IVector; // 1, 1, 1 by default
    texture: ITexture3D<TypedArray>;
}

export default IVolumeOptions;