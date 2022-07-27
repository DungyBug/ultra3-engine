import { IExplosionEntityParams } from "./explosion-params";
import EffectEntity from "../../entities/effect";
import SmallExplosionEffect from "./small-explosion";
import ClientWorld from "../../client-world";
import Vector from "../../../core/lib/vector";

class ExplosionEffect extends EffectEntity {
    private startTime: number;
    private explosions: Array<SmallExplosionEffect>;
    subExplosionsCount: number;
    duration: number;
    timeBetweenExplosions: number;
    radius: number;
    world: ClientWorld;

    constructor(params: IExplosionEntityParams, world: ClientWorld) {
        super(params, world);

        this.subExplosionsCount = params.subExplosionsCount;
        this.duration = params.duration;
        this.timeBetweenExplosions = params.timeBetweenExplosions;
        this.radius = params.radius;
        this.startTime = Date.now();
    }

    render() {
        return this.explosions;
    }

    think() {
        super.think();

        let deltaTime = Date.now() - this.startTime;

        if (
            deltaTime % this.timeBetweenExplosions === 0 &&
            this.explosions.length < this.subExplosionsCount
        ) {
            this.explosions.push(
                new SmallExplosionEffect(
                    {
                        classname: "effect_small_explosion",
                        model: null,
                        pos: Vector.add(
                            this.pos,
                            Vector.mul(
                                {
                                    x: Math.random() * 2 - 1,
                                    y: Math.random() * 2 - 1,
                                    z: Math.random() * 2 - 1,
                                },
                                new Vector(Math.random() * this.radius)
                            )
                        ),
                    },
                    this.world
                )
            );
        }
    }
}

export default ExplosionEffect;
