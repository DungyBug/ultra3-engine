import ClientWorld from "../client-world";
import {
    IEffectEntity,
    IEffectEntityParams,
} from "../contracts/entities/effect";
import IMesh from "../contracts/mesh";
import ISprite from "../contracts/sprite";
import ViewableEntity from "./base/viewable";

class EffectEntity extends ViewableEntity implements IEffectEntity {
    constructor(params: IEffectEntityParams, world: ClientWorld) {
        super(params, world);
    }

    render(): Array<IEffectEntity | ISprite | IMesh> {
        return [];
    }
}

export default EffectEntity;
