import { IPerspectiveCamera } from "./camera";

export default interface IThirdPersonViewCamera extends IPerspectiveCamera {
    distance: number;
}