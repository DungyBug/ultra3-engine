import { IExplosionEntityParams } from "../../contracts/effects/explosion/explosion-params";
import { EffectEntity } from "../../entities/effect";
import { VectorMath } from "../../vector-math";
import { World } from "../../world";
import { SmallExplosionEffect } from "./small-explosion";

class ExplosionEffect extends EffectEntity {
    private startTime: number;
    private explosions: Array<SmallExplosionEffect>;
    subExplosionsCount: number;
    duration: number;
    timeBetweenExplosions: number;
    radius: number;
    world: World;

    constructor(params: IExplosionEntityParams, world: World) {
        super({
            ...params,
            shader: {
                params: [],
                name: ""
            }
        }, world);

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

        if(deltaTime % this.timeBetweenExplosions === 0 && this.explosions.length < this.subExplosionsCount) {
            this.explosions.push(new SmallExplosionEffect({
                classname: "effect_small_explosion",
                model: "",
                shader: {
                    params: [],
                    name: ''
                },
                pos: VectorMath.add(this.pos, VectorMath.multiply({
                    x: Math.random() * 2 - 1,
                    y: Math.random() * 2 - 1,
                    z: Math.random() * 2 - 1
                }, Math.random() * this.radius))
            }, this.world));
        }
    }
}