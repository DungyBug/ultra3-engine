import IMesh from "../mesh";
import ISprite from "../sprite";
import { IViewableEntity, IViewableEntityParams } from "./base/viewable";

export interface IEffectEntityParams extends IViewableEntityParams {
};

export interface IEffectEntity extends IViewableEntity {
    /**
     * render
     * Returns entities to be rendered for some effects
     */
    render(): Array<IEffectEntity | ISprite | IMesh>;
};