import { IVector } from "../../contracts/base/vector";
import { ViewType } from "../constants/view-type";
import IBaseMesh from "./base-mesh";

interface IMesh extends IBaseMesh {
    castsShadow: boolean;
    viewType: ViewType;
    
    get verticies(): Array<IVector>;
}

export default IMesh;