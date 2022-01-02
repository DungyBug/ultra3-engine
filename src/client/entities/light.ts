import { IWorld } from "../../core/contracts/world";
import { Entity } from "../../core/entity";
import ILight, { ILightParams } from "../contracts/entities/light";

class LightEntity extends Entity implements ILight {
    itensity: number;
    radius: number;
    color: [number, number, number];

    constructor(params: ILightParams, world: IWorld) {
        super(params, world);

        this.itensity = params.itensity;
        this.radius = params.radius || 0;
        this.color = params.color;
    }
}

export default LightEntity;