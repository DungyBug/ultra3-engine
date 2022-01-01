import IMesh from "./client/contracts/mesh";
import GLTFLoader from "./client/lib/mesh-loader/gltf-loader/gltf-loader";
import * as BABYLON from "babylonjs";
import PBRMaterial from "./client/materials/pbr";

let loader = new GLTFLoader();


fetch("/models/long_rocket.glb")
    .then(data => data.blob())
    .then(data => data.arrayBuffer())
    .then(gltf => {
        loader.loadMeshes(gltf, "/models")
            .then(meshes => main(meshes[0]));
    })

function main(data: IMesh) {
    // Get the canvas DOM element
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.append(canvas);
    // Load the 3D engine
    var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
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
    light.intensity = 1;

    let customMesh = new BABYLON.Mesh("rocket", scene);

    let vertices = [];
    let normals = [];
    let uvs = [];

    for(let i = 0; i < data.vertices.length; i++) {
        vertices.push(data.vertices[i].x);
        vertices.push(data.vertices[i].y);
        vertices.push(data.vertices[i].z);
    }

    for(let i = 0; i < data.normals.length; i++) {
        normals.push(data.normals[i].x);
        normals.push(data.normals[i].y);
        normals.push(data.normals[i].z);
    }

    for(let i = 0; i < data.uvs.length; i++) {
        uvs.push(data.uvs[i].x);
        uvs.push(data.uvs[i].y);
    }

    let vertexData = new BABYLON.VertexData();
    
    vertexData.positions = vertices;
    vertexData.indices = data.indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    vertexData.applyToMesh(customMesh);

    const pbrmaterial = data.material as PBRMaterial;

    const material = new BABYLON.StandardMaterial("", scene);
    material.backFaceCulling = false;

    console.log(pbrmaterial.emissiveTexture.getRawData(0));

    material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
    material.emissiveTexture = new BABYLON.RawTexture(pbrmaterial.emissiveTexture.getRawData(0), pbrmaterial.emissiveTexture.dimensions[0], pbrmaterial.emissiveTexture.dimensions[1], BABYLON.Engine.TEXTUREFORMAT_RGBA, scene, false, false, BABYLON.Engine.TEXTURE_TRILINEAR_SAMPLINGMODE, BABYLON.Engine.TEXTURETYPE_UNSIGNED_BYTE);

    customMesh.material = material;
    customMesh.scaling = new BABYLON.Vector3(10, 10, 10);

    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
}