import { World } from "../world";
import { IHealthyEntity, IHealthyEntityParams } from "../contracts/entities/healthy";
import { Entity } from "../entity";

export class HealthyEntity extends Entity implements IHealthyEntity {
    health: number;
    dead: boolean;
    
    constructor(params: IHealthyEntityParams, world: World) {
        super(params, world);
        this.health = params.health || 100;
        this.dead = false;
    }

    damage(damage: number, attacker: Entity) {
        this.health -= damage;

        if(this.health <= 0) {
            this.dead = true;
        }
    }
}