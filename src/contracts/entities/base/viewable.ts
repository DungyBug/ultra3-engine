/*
ViewableEntity

Adding model to entity ( ans some other render parameters ) to see it in final render.
*/

import { ViewType } from "../../../constants/view-type";
import { IEntity, IEntityParams } from "../../entity";
import { IShader } from "../../shader";

export interface IViewableEntityParams extends IEntityParams {
    model: string;
    castsShadow?: boolean;
    shader: IShader;
    viewType?: ViewType;
}

export interface IViewableEntity extends IEntity {
    model: string; // Path for now
    castsShadow: boolean;
    shader: IShader;
    viewType: ViewType;
};