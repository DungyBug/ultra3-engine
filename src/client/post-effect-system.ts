import Vector from "../core/lib/vector";
import BaseCamera from "./cameras/base-camera";
import OrthogonalCamera from "./cameras/orthogonal-camera";
import PerspectiveCamera from "./cameras/perspective-camera";
import ClientEngine from "./client-engine";
import ViewableEntity from "./entities/base/viewable";
import FreeTexturedMaterial from "./materials/free-textured-material";
import Mesh from "./mesh/mesh";
import PostEffect from "./post-effect";
import Scene from "./scene";

class PostEffectSystem {
    private engine: ClientEngine;
    private readonly postEffects: Array<PostEffect>;
    private readonly tempEntity: ViewableEntity;
    private readonly scene: Scene;
    private readonly camera: PerspectiveCamera;

    constructor(engine: ClientEngine) {
        this.engine = engine;

        this.tempEntity = new ViewableEntity({
            classname: "u3_viewable_entity",
            pos: new Vector(0, 0, 0),
            model: new Mesh({
                pos: new Vector(0, 0, 0),
                scale: new Vector(1, 1, 0),
                vertices: [
                    new Vector(-1, 1, 0),
                    new Vector(1, -1, 0),
                    new Vector(1, 1, 0),
                    new Vector(-1, 1, 0),
                    new Vector(-1, -1, 0),
                    new Vector(1, -1, 0)
                ],
                indices: [0, 1, 2, 3, 4, 5],
                normals: [new Vector(0, 0, 1),new Vector(0, 0, 1),new Vector(0, 0, 1), new Vector(0, 0, 1),new Vector(0, 0, 1),new Vector(0, 0, 1)],
                uvs: [
                    new Vector(1.0, 0.0),
                    new Vector(0.0, 1.0),
                    new Vector(0.0, 0.0),
                    new Vector(1.0, 0.0),
                    new Vector(1.0, 1.0),
                    new Vector(0.0, 1.0)
                ],

                material: new FreeTexturedMaterial(this.engine, {texture: null})
            }, this.engine)
        }, this.engine.world);

        this.scene = new Scene({
            entities: [this.tempEntity]
        });

        const graphicsModule = this.engine.getGraphicsModule();

        if(graphicsModule === null) {
            // TODO: Queue all actions till graphics module is available
            throw new Error("Unable to init PostEffectSystem while graphics module is not set. Set graphics module first and then init PostEffectSystem.");
        }

        graphicsModule.setActiveScene(this.scene);
        this.camera = new PerspectiveCamera({position: new Vector(0, 0, -1), fov: Math.PI / 2});
        this.postEffects = [];
    }

    addPostEffect(postEffect: PostEffect) {
        this.postEffects.push(postEffect);
    }

    removePostEffect(postEffect: PostEffect) {
        const index = this.postEffects.indexOf(postEffect);

        if(index > -1) {
            this.postEffects.splice(index, 1);
        }
    }

    render(scene: Scene, camera: PerspectiveCamera | OrthogonalCamera) {
        if(this.postEffects.length === 0) {
            return;
        }

        const graphicsModule = this.engine.getGraphicsModule();

        if(graphicsModule === null) {
            throw new Error("Unable to render scene while graphics module is not set.");
        }

        graphicsModule.setActiveCamera(camera);

        const tempEntityMesh = <Mesh>this.tempEntity.model;

        this.postEffects.forEach((postEffect, i) => {
            if(i === 0) {
                // First post effect renders main scene
                postEffect.renderTexture.scene = scene;
                postEffect.renderTexture.render();
                postEffect.renderTexture.setActiveCamera(graphicsModule.getActiveCamera());
                tempEntityMesh.material = postEffect;
                tempEntityMesh.scale.x = postEffect.renderTexture.width / postEffect.renderTexture.height;
            } else {
                // Other post effects renders aux scene
                postEffect.renderTexture.scene = this.scene;
                postEffect.renderTexture.render();
                tempEntityMesh.material = postEffect;
                tempEntityMesh.scale.x = postEffect.renderTexture.width / postEffect.renderTexture.height;
            }
        });

        graphicsModule.setActiveCamera(this.camera);
    }
}

export default PostEffectSystem;