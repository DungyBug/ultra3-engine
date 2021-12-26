import IMesh from "./client/contracts/mesh";
import GLTFDataType from "./client/lib/constants/mesh-loader/gltf-loader/data-type";
import IGLTFStorage from "./client/lib/contracts/mesh-loader/gltf-loader/gltf-storage";
import GLTFLoader from "./client/lib/mesh-loader/gltf-loader/gltf-loader";
import * as BABYLON from "babylonjs";
import { StandardMaterial } from "babylonjs/Materials/standardMaterial";

let loader = new GLTFLoader();

// let verticiesArray = new Float32Array(10);
// verticiesArray[0] = 0;
// verticiesArray[1] = -1;
// verticiesArray[2] = -1;
// verticiesArray[3] = -1;
// verticiesArray[4] = 0;
// verticiesArray[5] = 0;
// verticiesArray[6] = 0;
// verticiesArray[7] = 1;
// verticiesArray[8] = 1;
// verticiesArray[9] = 1;
// let data = new DataView(verticiesArray.buffer);
// data.setUint8(0, 0);
// data.setUint8(1, 2);
// data.setUint8(2, 1);
// data.setUint8(3, 255);

fetch("/models/rocket_old.gltf")
    .then(data => data.json())
    .then((gltf: IGLTFStorage) => {
        fetch("/models/rocket_old.bin")
            .then(data => data.blob())
            .then(data => {
                data.arrayBuffer()
                    .then(buffer => {
                        console.log(gltf, buffer);
                        loader.loadBinaries([
                            {
                                name: "rocket_old.bin",
                                data: buffer
                            }
                        ]);
                        main(loader.parseGLTF(gltf)[0]);
                    })
            })
    })

function main(data: IMesh) {
    console.log(data);

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

    // Target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, false);

    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    var light = new BABYLON.PointLight('light1', new BABYLON.Vector3(2, 5, 0), scene);

    let customMesh = new BABYLON.Mesh("rocket", scene);

    let verticies = [];
    let normals = [];

    for(let i = 0; i < data.verticies.length; i++) {
        verticies.push(data.verticies[i].x);
        verticies.push(data.verticies[i].y);
        verticies.push(data.verticies[i].z);
    }

    for(let i = 0; i < data.normals.length; i++) {
        normals.push(data.normals[i].x);
        normals.push(data.normals[i].y);
        normals.push(data.normals[i].z);
    }

    let vertexData = new BABYLON.VertexData();
    
    vertexData.positions = verticies;
    vertexData.indices = data.indices;
    vertexData.normals = normals;

    vertexData.applyToMesh(customMesh);

    customMesh.material = new BABYLON.StandardMaterial("", scene);
    customMesh.material.backFaceCulling = false;

    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });
}