import { IPickableEntity } from "../contracts/entities/pickable";
import { IPlayer, IPlayerParams, IPlayerState } from "../contracts/entities/player";
import { ClassPattern } from "../contracts/ent_types";
import { World } from "../world";
import { HealthyEntity } from "./healthy";

export class Player extends HealthyEntity implements IPlayer {
    protected inventory: Array<IPickableEntity>;
    readonly classname: ClassPattern<"player">;

    constructor(params: IPlayerParams, world: World) {
        super(params, world);
    }

    pick(entity: IPickableEntity) {
        this.inventory.push(entity);
        entity.pick(this);
    }

    unpick(entity: IPickableEntity) {
        let index = this.inventory.indexOf(entity);

        // Check for entity existance in inventory
        if(index !== -1) {
            entity.unpick();
            this.inventory.splice(index, 1); // Delete entity
        }
    }

    getEntityState(): IPlayerState {
        let parentState = super.getEntityState();
        let inventory: Array<number> = [];

        for(let i = 0; i < this.inventory.length; i++) {
            inventory.push(this.inventory[i].id);
        }

        return {
            ...parentState,
            inventory
        }
    }

    setEntityState(state: IPlayerState): void {
        super.setEntityState(state);

        this.inventory = [];

        for(let i = 0; i < state.inventory.length; i++) {
            let entity = this.world.getEntity(state.inventory[i]) as IPickableEntity;

            if(typeof entity.pick !== "function" || typeof entity.unpick !== "function") {
                throw new Error(`TypeError: Type of entity ${entity.id}:${entity.classname} is not assignable to type "IPickableEntity".`);
            }

            this.inventory.push(entity);
        }
    }
}