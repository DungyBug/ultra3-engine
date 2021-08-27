import { World } from "../../world";
import { ViewType } from "../../constants/view-type";
import { IViewableEntity, IViewableEntityParams } from "../../contracts/entities/base/viewable";
import { IShader } from "../../contracts/shader";
import { Entity } from "../../entity";

export class ViewableEntity extends Entity implements IViewableEntity {
    model: string; // Path for now
    castsShadow: boolean;
    shader: IShader;
    viewType: ViewType;

    constructor(params: IViewableEntityParams, world: World) {
        super(params, world);
        this.model = params.model;
        this.shader = params.shader;
        this.viewType = params.viewType || ViewType.model;
        this.castsShadow = params.castsShadow || true;
    }
}