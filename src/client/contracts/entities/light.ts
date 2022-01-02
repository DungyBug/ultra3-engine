import { IEntity, IEntityParams } from "../../../core/contracts/entity";

interface ILight extends IEntity {
    itensity: number;
    radius: number;
    color: [number, number, number];
};

export interface ILightParams extends IEntityParams {
    itensity: number;
    radius?: number; // 0 by default
    color?: [number, number, number]; // 1 1 1 by default
}

export default ILight;