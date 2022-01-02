import { IEntity } from "../../../core/contracts/entity";

interface ILight extends IEntity {
    itensity: number;
    radius: number;
};

export interface ILightOptions extends IEntity {
    itensity: number;
    radius?: number; // 0 by default
}

export default ILight;