import PhysicalModelType from "../constants/physical-model-type";
import { IVector } from "./base/vector";

interface IBasePhysicalModel {
    type: PhysicalModelType;
    shift: IVector;
    rotation: IVector;
    scale: IVector;
}

export default IBasePhysicalModel;