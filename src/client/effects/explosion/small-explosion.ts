import { World } from "../../../core/world";
import TypedArray from "../../contracts/common/typed-array";
import ITexture2D from "../../contracts/texture/texture2d";
import EffectEntity from "../../entities/effect";
import { ISmallExplosionEntityParams } from "./small-explosion-params";

class SmallExplosionEffect extends EffectEntity {
    private startTime: number;

    constructor(params: ISmallExplosionEntityParams, world: World) {
        super({
            ...params,
            model: null
        }, world);

        this.startTime = Date.now();
    }

    think() {
        super.think();

        let deltaTime = Date.now() - this.startTime;

        let frame = Math.floor(deltaTime / (1000 / 60));

        if(frame > 120) {
            this.delete();
        }
    }

    render() {
        return [
            {
                pos: this.pos,
                size: {
                    x: 1,
                    y: 1
                },
                angles: [] as Array<ITexture2D<TypedArray>>,
            } 
        ];
    }
}

export default SmallExplosionEffect;