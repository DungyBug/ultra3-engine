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

        this.engine.getGraphicsModule().setActiveScene(this.scene);
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
        graphicsModule.setActiveCamera(camera);

        const tempEntityMesh = <Mesh>this.tempEntity.model;

        // First post effect renders main scene
        this.postEffects[0].renderTexture.scene = scene;
        this.postEffects[0].renderTexture.render();
        this.postEffects[0].renderTexture.setActiveCamera(graphicsModule.getActiveCamera());
        tempEntityMesh.material = this.postEffects[0];
        tempEntityMesh.scale.x = this.postEffects[0].renderTexture.width / this.postEffects[0].renderTexture.height;

        // Other post effects renders aux scene
        for(let i = 1; i < this.postEffects.length; i++) {
            this.postEffects[i].renderTexture.scene = this.scene;
            this.postEffects[i].renderTexture.render();
            tempEntityMesh.material = this.postEffects[i];
            tempEntityMesh.scale.x = this.postEffects[i].renderTexture.width / this.postEffects[i].renderTexture.height;
        }

        graphicsModule.setActiveCamera(this.camera);
    }
}

export default PostEffectSystem;