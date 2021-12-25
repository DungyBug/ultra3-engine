import { ClassPattern } from '../../core/contracts/ent_types';
import { World } from '../../core/world';
import { IEffectEntity, IEffectEntityParams } from '../contracts/entities/effect';
import IMesh from '../contracts/mesh';
import ISprite from '../contracts/sprite';
import ViewableEntity from './base/viewable';

class EffectEntity extends ViewableEntity implements IEffectEntity {
    classname: ClassPattern<"effect">;
    model: IMesh;

    constructor(params: IEffectEntityParams, world: World) {
        super(params, world);
    }

    render(): Array<IEffectEntity | ISprite | IMesh> {
        return [];
    }
}

export default EffectEntity;