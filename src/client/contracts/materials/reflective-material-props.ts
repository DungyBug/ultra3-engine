import TextureCubemap from "../../texture/texture-cubemap";
import IBaseMaterialProps from "./base-material-props";

export default interface IReflectiveMaterialProps extends IBaseMaterialProps {
    texture: TextureCubemap;
}