import { IVector } from "../../core/contracts/base/vector";
import IVector2D from "../../core/contracts/base/vector2d";
import TypedArray from "./common/typed-array";
import ITexture2D from "./texture/texture2d";

interface ISprite {
    pos: IVector;
    size: IVector2D;

    angles: Array<ITexture2D<TypedArray>>;
    mirrorImages?: boolean; // Mirror angles for other sides. False by default
}

export default ISprite;