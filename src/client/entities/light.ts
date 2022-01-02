import { IWorld } from "../../core/contracts/world";
import { Entity } from "../../core/entity";
import ILight, { ILightOptions } from "../contracts/entities/light";

class LightEntity extends Entity implements ILight {
    itensity: number;
    radius: number;

    constructor(params: ILightOptions, world: IWorld) {
        super(params, world);

        this.itensity = params.itensity;
        this.radius = params.radius || 0;
    }
}

export default LightEntity;