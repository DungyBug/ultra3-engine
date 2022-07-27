/*
There are all damage functions such as:
damageEntitiesInRadius
*/

import { IVector } from "./contracts/base/vector";
import { IWorld } from "./contracts/world";
import { HealthyEntity } from "./entities/healthy";
import { Entity } from "./entity";
import Vector from "./lib/vector";

/**
 * Damages entities in radius of world <world>
 * @param world - world where to damage entities
 * @param radius - radius in where to damage entities
 * @param pos - position of damage sphere
 * @param damage - damage in center of damage sphere
 * @param attacker - initiator ( player, bot, etc. )
 */
export function damageEntitiesInRadius(world: IWorld, radius: number, pos: IVector, damage: number, attacker: Entity = null) {
    for(let i = 0; i < world.entities.length; i++) {
        // Get length between entity position and explosion position
        let length = Vector.magnitude(Vector.sub(world.entities[i].pos, pos));

        // Check if entity is too far from explosion to take damage
        if(length > radius ** 2) {
            continue;
        }

        // Check if entity extends HealthyEntity ( has "health" property and "damage" method )
        const entity = world.entities[i];
        if(entity instanceof HealthyEntity) {
            // Get final damage: the further you from explosion - the smaller damage you take
            let outputDamage = damage * ((1 - length / (radius ** 2)) ** 2);

            // Damage entity
            entity.damage(outputDamage, attacker);
        }
    }
}