import Vector from "./base/vector";
import { ViewType } from "./client/constants/view-type";
import ClientPhysicalEntity from "./client/entities/base/physical";
import PhysicalModelType from "./constants/physical-model-type";
import { IKey } from "./contracts/base/key";
import { IVector } from "./contracts/base/vector";
import { World } from "./world";

let world = new World();

let ent = new ClientPhysicalEntity({
    physicalModel: {
        type: PhysicalModelType.cube,
        scale: new Vector(1),
        rotation: new Vector(0),
        shift: new Vector(0)
    },
    classname: "asdf",
    model: {
        pos: new Vector(0),
        scale: new Vector(1),
        rotation: new Vector(0),
        castsShadow: false,
        viewType: ViewType.model,

        get verticies() {
            return [] as Array<IVector>;
        },

        get material() {
            return {
                getShader: () => ({
                    params: [] as Array<IKey>,
                    name: "asdf"
                })
            }
        }
    }
}, world);