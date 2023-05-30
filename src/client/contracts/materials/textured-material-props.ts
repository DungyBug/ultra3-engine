import Texture2D from "../../texture/texture2d";
import IBaseMaterialProps from "./base-material-props";

export default interface ITexturedMaterialProps extends IBaseMaterialProps {
    texture: Texture2D | null;
}