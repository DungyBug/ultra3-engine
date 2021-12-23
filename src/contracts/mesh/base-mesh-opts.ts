import { IVector } from "../base/vector";
import IMaterial from "../material";

interface IBaseMeshOptions {
    pos: IVector;
    scale: IVector;
    rotation: IVector;
    material: IMaterial;
    verticies: Array<IVector>;
}

export default IBaseMeshOptions;