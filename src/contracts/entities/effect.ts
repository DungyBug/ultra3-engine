import { IShader } from "../shader";
import { IViewableEntity, IViewableEntityParams } from "./base/Viewable";
import { ClassPattern } from "../ent_types";

export interface IEffectEntityParams extends IViewableEntityParams {
    classname: ClassPattern<"effect">;
    shader: IShader;
};

export interface IEffectEntity extends IViewableEntity {
    classname: ClassPattern<"effect">;
    shader: IShader;

    /**
     * render
     * Returns entities to be rendered for some effects
     */
    render(): Array<IEffectEntity>;
};