import { IEntityState } from "../../../core/contracts/entity";
import { Entity } from "../../../core/entity";
import ClientWorld from "../../client-world";
import {
    IViewableEntity,
    IViewableEntityParams,
} from "../../contracts/entities/base/viewable";
import IMesh from "../../contracts/mesh";

class ViewableEntity extends Entity implements IViewableEntity {
    model: IMesh;

    constructor(params: IViewableEntityParams, world: ClientWorld) {
        super(params, world);
        // this.model = params.model;
        this.model = {
            pos: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            vertices: [],
            indices: [],
            uvs: [],
            normals: [],
            castsShadow: false,
            verticesMode: 0,
            material: {
                getShader: function () {
                    return {
                        params: [],
                        name: "",
                        type: "fragment",
                    };
                },
            },
        };

        world.pushEntityToRenderQueue(this);
    }

    setEntityState(state: IEntityState): void {
        super.setEntityState(state);
        this.model.pos = state.pos;
    }
}

export default ViewableEntity;
