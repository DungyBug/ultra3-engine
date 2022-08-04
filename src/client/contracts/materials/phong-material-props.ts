import ITexturedMaterialProps from "./textured-material-props";

export default interface IPhongMaterialProps extends ITexturedMaterialProps {
    shininess?: number;
    distribution?: number;
}