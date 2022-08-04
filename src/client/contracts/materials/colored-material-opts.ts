import IBaseMaterialProps from "./base-material-props";

export default interface IColoredMaterialProps extends IBaseMaterialProps {
    color?: [number, number, number];
}