import { World } from '../../world';
import { IEffectEntity, IEffectEntityParams } from '../contracts/entities/effect';
import { ClassPattern } from '../../contracts/ent_types';
import IMesh from '../contracts/mesh';
import ViewableEntity from './base/viewable';

class EffectEntity extends ViewableEntity implements IEffectEntity {
    classname: ClassPattern<"effect">;
    model: IMesh;

    constructor(params: IEffectEntityParams, world: World) {
        super(params, world);
    }

    render(): Array<IEffectEntity> {
        return [];
    }
}

export default EffectEntity;