/*
ViewableEntity

Adding model to entity ( ans some other render parameters ) to see it in final render.
*/

import { IEntity, IEntityParams } from "../../../../contracts/entity";
import IMesh from "../../mesh";

export interface IViewableEntityParams extends IEntityParams {
    model: IMesh;
}

export interface IViewableEntity extends IEntity {
    model: IMesh;
};