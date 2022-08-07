import { IMapObjectProps } from "../../../core/contracts/map-object";
import Vector from "../../../core/lib/vector";
import BaseCamera from "../../cameras/base-camera";
import IMesh from "../mesh";

export default interface IClientPortalProps extends IMapObjectProps {
    mesh: IMesh;
    camera: BaseCamera;
    rotation: Vector; // set class type to easily assign link of this variable
}