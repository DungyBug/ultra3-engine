import { World } from "../world";
import { IHealthyEntity, IHealthyEntityParams, IHealthyEntityState } from "../contracts/entities/healthy";
import { Entity } from "../entity";

export class HealthyEntity extends Entity implements IHealthyEntity {
    health: number;
    dead: boolean;
    
    constructor(params: IHealthyEntityParams, world: World) {
        super(params, world);
        this.health = params.health || 100;
        this.dead = false;
    }

    damage(damage: number, attacker: Entity | null) {
        this.health -= damage;

        if(this.health <= 0) {
            this.dead = true;
        }
    }
    
    getEntityState(): IHealthyEntityState {
        let parentState = super.getEntityState();

        return {
            ...parentState,
            health: this.health
        }
    }
    
    setEntityState(state: IHealthyEntityState): void {
        super.setEntityState(state);

        this.health = state.health;
    }

    static fromState(state: IHealthyEntityState, world: World): HealthyEntity {
        const entity = new HealthyEntity(state, world);

        entity.setEntityState(state);

        return entity;
    }
}