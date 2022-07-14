import { IWorld } from "../../core/contracts/world";
import { Entity } from "../../core/entity";
import Vector from "../../core/lib/vector";
import ILight, { LightEntityParams } from "../contracts/entities/light";

class LightEntity extends Entity implements ILight {
    itensity: number;
    radius: number;
    type: string;
    direction: Vector;
    innerAngle: number;
    outerAngle: number;
    color: [number, number, number];

    constructor(params: LightEntityParams, world: IWorld) {
        super(params, world);

        this.type = params.type;
        this.itensity = params.itensity;
        this.radius = params.radius || 0;
        this.color = params.color;

        if(params.type === "spot") {
            this.direction = params.direction;
            this.innerAngle = params.innerAngle;
            this.outerAngle = params.outerAngle;
        } else {
            this.direction = new Vector(0, 0, 0);
            this.innerAngle = 0;
            this.outerAngle = 0;
        }
    }
}

export default LightEntity;