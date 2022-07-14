import { IEntity, IEntityParams } from "../../../core/contracts/entity";
import Vector from "../../../core/lib/vector";

interface ILight extends IEntity {
    itensity: number;
    radius: number;
    color: [number, number, number];
};

export interface IBaseLightParams {
    type: string;
    itensity: number;
    radius?: number; // 0 by default
    color?: [number, number, number]; // 1 1 1 by default
}

interface IPointLightParams extends IBaseLightParams {
    type: "point";
}

interface ISpotLightParams extends IBaseLightParams {
    type: "spot";
    innerAngle: number; // in radians
    outerAngle: number; // in radians
    direction: Vector;
}

export type LightEntityParams = (IPointLightParams | ISpotLightParams) & IEntityParams;

export default ILight;