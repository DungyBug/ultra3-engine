import IMesh from "./client/contracts/mesh";
import GLTFDataType from "./client/lib/constants/mesh-loader/gltf-loader/data-type";
import IGLTFStorage from "./client/lib/contracts/mesh-loader/gltf-loader/gltf-storage";
import GLTFLoader from "./client/lib/mesh-loader/gltf-loader/gltf-loader";
import * as BABYLON from "babylonjs";
import { StandardMaterial } from "babylonjs/Materials/standardMaterial";

let loader = new GLTFLoader();

// let verticesArray = new Float32Array(10);
// verticesArray[0] = 0;
// verticesArray[1] = -1;
// verticesArray[2] = -1;
// verticesArray[3] = -1;
// verticesArray[4] = 0;
// verticesArray[5] = 0;
// verticesArray[6] = 0;
// verticesArray[7] = 1;
// verticesArray[8] = 1;
// verticesArray[9] = 1;
// let data = new DataView(verticesArray.buffer);
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

    camera.minZ = 0.01;

    // Target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, false);

    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    var light = new BABYLON.PointLight('light1', new BABYLON.Vector3(10, 25, 0), scene);
    light.intensity = 1;

    let customMesh = new BABYLON.Mesh("rocket", scene);

    let vertices = [];
    let normals = [];

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

    let vertexData = new BABYLON.VertexData();
    
    vertexData.positions = vertices;
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