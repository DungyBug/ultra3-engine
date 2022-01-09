import GLTFLoader from "./client/lib/mesh-loader/gltf-loader/gltf-loader";
import * as BABYLON from "babylonjs";
import { World } from "./core/world";
import IScene from "./client/contracts/scene";

const world = new World();
let loader = new GLTFLoader(world);

fetch("/models/waterbottle.gltf")
    .then(data => data.blob())
    .then(data => data.arrayBuffer())
    .then(gltf => {
        loader.loadMeshes(gltf, "/models")
            .then(scene => main(scene));
    });

function main(GLTFScene: IScene) {
    console.log(GLTFScene);
    // Get the canvas DOM element
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.append(canvas);
    // Load the 3D engine
    var engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        antialias: true,
        depth: true,
    });
    // CreateScene function that creates and return the scene

    // Create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);

    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);

    camera.minZ = 0.01;

    // Target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, false);

    var light = new BABYLON.PointLight('light1', new BABYLON.Vector3(10, 25, 0), scene);
    light.intensity = 10000;
    light.shadowEnabled = true;
    light.radius = 1;

    // Load all meshes
    for(let i = 0; i < GLTFScene.meshes.length; i++) {
        let customMesh = new BABYLON.Mesh("rocket", scene);

        let vertices = [];
        let normals = [];
        let uvs = [];

        for(let j = 0; j < GLTFScene.meshes[i].vertices.length; j++) {
            vertices.push(GLTFScene.meshes[i].vertices[j].x);
            vertices.push(GLTFScene.meshes[i].vertices[j].y);
            vertices.push(GLTFScene.meshes[i].vertices[j].z);
        }

        for(let j = 0; j < GLTFScene.meshes[i].normals.length; j++) {
            normals.push(GLTFScene.meshes[i].normals[j].x);
            normals.push(GLTFScene.meshes[i].normals[j].y);
            normals.push(GLTFScene.meshes[i].normals[j].z);
        }

        for(let j = 0; j < GLTFScene.meshes[i].uvs.length; j++) {
            uvs.push(GLTFScene.meshes[i].uvs[j].x);
            uvs.push(GLTFScene.meshes[i].uvs[j].y);
        }

        let vertexData = new BABYLON.VertexData();
        
        vertexData.positions = vertices;
        vertexData.indices = GLTFScene.meshes[i].indices;
        vertexData.normals = normals;
        vertexData.uvs = uvs;

        vertexData.applyToMesh(customMesh);

        // const pbrmaterial = GLTFScene.meshes[i].material as PBRMaterial;

        const material = new BABYLON.PBRSpecularGlossinessMaterial("", scene);
        material.backFaceCulling = false;

        material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
        //material.emissiveTexture = new BABYLON.RawTexture(pbrmaterial.emissiveTexture.getRawData(0), pbrmaterial.emissiveTexture.dimensions[0], pbrmaterial.emissiveTexture.dimensions[1], BABYLON.Engine.TEXTUREFORMAT_RGBA, scene, false, false, BABYLON.Engine.TEXTURE_TRILINEAR_SAMPLINGMODE, BABYLON.Engine.TEXTURETYPE_UNSIGNED_BYTE);
        material.glossiness = 0;
        customMesh.material = material;
    }

    // Load all lights
    for(let i = 0; i < GLTFScene.lights.length; i++) {
        let glight = new BABYLON.PointLight(`light${i}`, new BABYLON.Vector3(GLTFScene.lights[i].pos.x, GLTFScene.lights[i].pos.y, GLTFScene.lights[i].pos.z + 3.0), scene);
        glight.intensity = GLTFScene.lights[i].itensity * 1000;
        glight.radius = GLTFScene.lights[i].radius;
        glight.shadowEnabled = true;
        glight.diffuse = new BABYLON.Color3(...GLTFScene.lights[i].color);

        let gshadowGenerator = new BABYLON.ShadowGenerator(1024, glight);
        gshadowGenerator.bias = 0.00001;

        for(let j = 0; j < scene.meshes.length; j++) {
            gshadowGenerator.getShadowMap().renderList.push(scene.meshes[j]);
        }
    }

    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
}