import { IVector } from "../../core/contracts/base/vector";
import IMaterial from "./material";

interface IBaseMesh {
    pos: IVector;
    scale: IVector;
    rotation: IVector;

    get material(): IMaterial;
}

export default IBaseMesh