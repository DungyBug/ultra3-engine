import { IPickableEntity } from "../contracts/entities/pickable";
import { IPlayer, IPlayerParams } from "../contracts/entities/player";
import { World } from "../world";
import { HealthyEntity } from "./healthy";

export class Player extends HealthyEntity implements IPlayer {
    protected inventory: Array<IPickableEntity>;
    readonly classname: "player";
    
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
}