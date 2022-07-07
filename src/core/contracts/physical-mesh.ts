import { IVector } from "./base/vector";

interface IPhysicalMesh {
    pos: IVector;
    scale: IVector;
    rotation: IVector;

    get vertices(): Array<IVector>;
    get indices(): Array<number>;
    get normals(): Array<IVector>;
}

export default IPhysicalMesh;