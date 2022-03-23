import BaseRenderer from "./base-renderer";
import * as BABYLON from "babylonjs";
import IMesh from "../contracts/mesh";
import { IKey } from "../../core/contracts/base/key";

class BabylonRenderer extends BaseRenderer {
    private _engine: BABYLON.Engine;
    private _camera: BABYLON.FreeCamera;
    private _scene: BABYLON.Scene;
    private _meshes: Array<BABYLON.Mesh>;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this._engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: false,
        });

        this._scene = new BABYLON.Scene(this._engine);

        this._camera = new BABYLON.FreeCamera(
            "camera",
            new BABYLON.Vector3(0, 0, -2),
            this._scene
        );
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._camera.attachControl(canvas, true);

        this._meshes = [];

        const light = new BABYLON.PointLight(
            "light",
            new BABYLON.Vector3(1, 1.5, 0),
            this._scene
        );

        const sphere = BABYLON.MeshBuilder.CreateSphere(
            "sphere",
            {
                segments: 8,
                diameter: 2,
                sideOrientation: BABYLON.Mesh.FRONTSIDE,
            },
            this._scene
        );
        sphere.position = BABYLON.Vector3.Zero();

        this.render = this.render.bind(this);
    }

    addMesh(mesh: IMesh): void {
        super.addMesh(mesh);

        // const newMesh = new BABYLON.Mesh("", this._scene);

        // const vertexData = new BABYLON.VertexData();

        // // Convert vertices to flat array of positions
        // const positions = new Float32Array();
        // const vertices = mesh.vertices;

        // for (let i = 0; i < vertices.length; i++) {
        //     positions[i * 3] = vertices[i].x;
        //     positions[i * 3 + 1] = vertices[i].y;
        //     positions[i * 3 + 2] = vertices[i].z;
        // }

        // vertexData.positions = positions;
        // vertexData.indices = mesh.indices;
        // // normals, uvs...

        // A sphere for now
        const sphere = BABYLON.MeshBuilder.CreateSphere(
            "sphere",
            {
                segments: 8,
                diameter: 2,
                sideOrientation: BABYLON.Mesh.FRONTSIDE,
            },
            this._scene
        );
        sphere.position = BABYLON.Vector3.Zero();
        sphere.rotation = BABYLON.Vector3.Zero();

        this._meshes.push(sphere);
    }

    deleteMesh(mesh: IMesh): void {
        const index = this.meshes.indexOf(mesh);

        if (index !== -1) {
            this._meshes.splice(index, 1);
            super.deleteMesh(mesh);
        }
    }

    setupScreenPostEffect(frag: string, uniforms?: IKey[]): 0 | -1 {
        return -1;
    }

    runRenderLoop(): void {
        this._engine.runRenderLoop(this.render);
    }

    render(): void {
        // Update meshes rotation, position
        this._scene.render();

        this._camera.position.x = this.camera.position.x;
        this._camera.position.y = this.camera.position.y;
        this._camera.position.z = this.camera.position.z;

        this.camera.rotation.x = this._camera.rotation.x;
        this.camera.rotation.y = this._camera.rotation.y;
        this.camera.rotation.z = this._camera.rotation.z;

        for (let i = 0; i < this.meshes.length; i++) {
            this._meshes[i].rotation.x = this.meshes[i].rotation.x;
            this._meshes[i].rotation.y = this.meshes[i].rotation.y;
            this._meshes[i].rotation.z = this.meshes[i].rotation.z;

            this._meshes[i].position.x = this.meshes[i].pos.x;
            this._meshes[i].position.y = this.meshes[i].pos.y;
            this._meshes[i].position.z = this.meshes[i].pos.z;
        }
    }
}

export default BabylonRenderer;
