import { ViewType } from "../../constants/view-type";
import { ISmallExplosionEntityParams } from "../../../contracts/effects/explosion/small-explosion-params";
import { EffectEntity } from "../../entities/effect";
import { World } from "../../../world";

class SmallExplosionEffect extends EffectEntity {
    private startTime: number;

    constructor(params: ISmallExplosionEntityParams, world: World) {
        super({
            ...params,
            shader: {
                params: [{
                    name: "frame",
                    value: 0
                }],
                name: "textured"
            },
            viewType: ViewType.sprite
        }, world);

        this.startTime = Date.now();
    }

    think() {
        super.think();

        let deltaTime = Date.now() - this.startTime;

        let frame = Math.floor(deltaTime / (1000 / 60));
        this.shader.params[0].value = frame;

        if(frame > 120) {
            this.delete();
        }
    }
}

export default SmallExplosionEffect;