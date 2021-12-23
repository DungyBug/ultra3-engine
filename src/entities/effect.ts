import { World } from '../world';
import { IEffectEntity, IEffectEntityParams } from '../contracts/entities/effect';
import { ClassPattern } from '../contracts/ent_types';
import { IShader } from '../contracts/shader';
import { ViewableEntity } from './base/viewable';

export class EffectEntity extends ViewableEntity implements IEffectEntity {
    classname: ClassPattern<"effect">;
    shader: IShader;

    constructor(params: IEffectEntityParams, world: World) {
        super(params, world);

        this.shader = params.shader;
    }

    render(): Array<IEffectEntity> {
        return [];
    }
}