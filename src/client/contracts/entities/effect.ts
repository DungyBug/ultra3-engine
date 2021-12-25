import { ClassPattern } from "../../../core/contracts/ent_types";
import IMesh from "../mesh";
import ISprite from "../sprite";
import { IViewableEntity, IViewableEntityParams } from "./base/viewable";

export interface IEffectEntityParams extends IViewableEntityParams {
    classname: ClassPattern<"effect">;
};

export interface IEffectEntity extends IViewableEntity {
    classname: ClassPattern<"effect">;

    /**
     * render
     * Returns entities to be rendered for some effects
     */
    render(): Array<IEffectEntity | ISprite | IMesh>;
};