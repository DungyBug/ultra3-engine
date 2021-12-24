import { PhysicalEntity } from "./base/physical";
import { IExplosiveEntity, IExplosiveEntityParams, IExplosiveEntityState } from "../contracts/entities/explosive";
import { World } from "../world";
import { damageEntitiesInRadius } from "../damage";

export class ExplosiveEntity extends PhysicalEntity implements IExplosiveEntity {
    explodeDamage: number;
    explodeRadius: number;

    constructor(params: IExplosiveEntityParams, world: World) {
        super(params, world);

        this.explodeDamage = params.explodeDamage || 100;
        this.explodeRadius = params.explodeRadius || 2.5;
    }

    explode() {
        // Generate explosion effect
        
        damageEntitiesInRadius(this.world, this.explodeRadius, this.pos, this.explodeDamage);
    }
    
    getEntityState(): IExplosiveEntityState {
        let parentState = super.getEntityState();

        return {
            ...parentState,
            explodeRadius: this.explodeRadius,
            explodeDamage: this.explodeDamage
        }
    }

    setEntityState(state: IExplosiveEntityState): void {
        super.setEntityState(state);

        this.explodeRadius = state.explodeRadius;
        this.explodeDamage = state.explodeDamage;
    }
}