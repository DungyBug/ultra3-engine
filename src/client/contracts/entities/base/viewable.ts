/*
ViewableEntity

Adding model to entity ( ans some other render parameters ) to see it in final render.
*/

import { IEntityParams, IEntity } from "../../../../core/contracts/entity";
import IMesh from "../../mesh";

export interface IViewableEntityParams extends IEntityParams {
    model: IMesh | null;
}

export interface IViewableEntity extends IEntity {
    model: IMesh | null;
};