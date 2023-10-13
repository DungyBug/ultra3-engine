import { IPickableEntity } from "../contracts/entities/pickable";
import {
    IPlayer,
    IPlayerParams,
    IPlayerState,
} from "../contracts/entities/player";
import { World } from "../world";
import { HealthyEntity } from "./healthy";

export class Player extends HealthyEntity implements IPlayer {
    protected inventory: Array<IPickableEntity> = [];

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
        if (index !== -1) {
            entity.unpick();
            this.inventory.splice(index, 1); // Delete entity
        }
    }

    getEntityState(): IPlayerState {
        let parentState = super.getEntityState();
        let inventory: Array<number> = [];

        for (const item of this.inventory) {
            inventory.push(item.id);
        }

        return {
            ...parentState,
            inventory,
        };
    }

    setEntityState(state: IPlayerState): void {
        super.setEntityState(state);

        this.inventory = [];

        for (const item of state.inventory) {
            const entity = this.world.getEntity(item) as IPickableEntity | null;

            if(entity === null) {
                continue;
            }

            if (
                typeof entity.pick !== "function" ||
                typeof entity.unpick !== "function"
            ) {
                throw new Error(
                    `TypeError: Type of entity ${entity.id}:${entity.classname} is not assignable to type "IPickableEntity".`
                );
            }

            this.inventory.push(entity);
        }
    }

    static fromState(state: IPlayerState, world: World): Player {
        const entity = new Player(state, world);

        entity.setEntityState(state);

        return entity;
    }
}
