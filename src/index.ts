import WSTransporter from "./client/services/transporter/ws-transporter";
import Client from "./client/client";
import { Registry } from "./core/registry";
import BabylonRenderer from "./client/renderers/babylon-renderer";
import { Player } from "./core/entities/player";
import ViewableEntity from "./client/entities/base/viewable";
import { Door } from "./core/map/objects/door";

// let state: Record<string, any> = {};
// let attached = false;
// const keys: Array<boolean> = new Array(113).fill(false);

// UI side
const canvas = document.createElement("canvas");
canvas.width = 1920;
canvas.height = 1080;
document.body.append(canvas);

const registry = new Registry();

registry.registerClass("player_player", ViewableEntity);

const client = new Client(
    {
        gravity: 9.81,
        thinkPeriod: 100 / 6,
    },
    registry,
    new BabylonRenderer(canvas)
);

new Door(
    "",
    {
        speed: 10,
        distance: 10,
        direction: { x: 0, y: -1, z: 0 },
        name: "door1",
        rotation: { x: 0, y: 0, z: 0 },
        pos: { x: 0, y: 10, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
    },
    client
);
client.start(new WSTransporter("ws://192.168.0.21:3003/"));

// const engine = new BABYLON.Engine(canvas, true, {
//     preserveDrawingBuffer: true,
//     stencil: true,
// });

// const scene = new BABYLON.Scene(engine);

// const camera = new BABYLON.FreeCamera(
//     "camera",
//     new BABYLON.Vector3(0, 0, -2),
//     scene
// );

// camera.setTarget(BABYLON.Vector3.Zero());

// camera.attachControl(canvas, true);

// const light = new PointLight("light", new BABYLON.Vector3(1, 1.5, 0), scene);

// const sphere = BABYLON.MeshBuilder.CreateSphere(
//     "sphere",
//     { segments: 8, diameter: 2, sideOrientation: BABYLON.Mesh.FRONTSIDE },
//     scene
// );
// sphere.position = BABYLON.Vector3.Zero();

// const ground = BABYLON.MeshBuilder.CreateGround(
//     "ground",
//     { width: 6, height: 6, updatable: false },
//     scene
// );

// engine.runRenderLoop(() => {
//     scene.render();

//     if (state.hasOwnProperty("entities") && state.thisEntity !== -1) {
//         const entity = state.entities[state.thisEntity] as IEntityState;

//         camera.position = new BABYLON.Vector3(
//             entity.pos.x,
//             entity.pos.y,
//             entity.pos.z
//         );
//     }

//     if (keys[87]) {
//         server.send(
//             JSON.stringify({
//                 type: "update-player-state",
//                 data: {
//                     event: "move",
//                     angle: camera.rotation.y,
//                 },
//             }),
//             false
//         );
//     }
//     if (keys[83]) {
//         server.send(
//             JSON.stringify({
//                 type: "update-player-state",
//                 data: {
//                     event: "move",
//                     angle: camera.rotation.y + Math.PI,
//                 },
//             }),
//             false
//         );
//     }
//     if (keys[65]) {
//         server.send(
//             JSON.stringify({
//                 type: "update-player-state",
//                 data: {
//                     event: "move",
//                     angle: camera.rotation.y - Math.PI * 0.5,
//                 },
//             }),
//             false
//         );
//     }
//     if (keys[68]) {
//         server.send(
//             JSON.stringify({
//                 type: "update-player-state",
//                 data: {
//                     event: "move",
//                     angle: camera.rotation.y + Math.PI * 0.5,
//                 },
//             }),
//             false
//         );
//     }
// });

// // Client side

// let server = new Transport(new WSTransporter("ws://192.168.0.21:3003/"));

// server.onMessage((message, res) => {
//     console.log(message);
//     res("asdf");
// });

// function frame() {
//     server
//         .send(
//             JSON.stringify({
//                 type: "get-state",
//             }),
//             true
//         )
//         .then((data: string) => {
//             state = JSON.parse(data);
//         });

//     requestAnimationFrame(frame);
// }

// frame();

// document.addEventListener("keydown", (e) => {
//     keys[e.keyCode] = true;
// });

// document.addEventListener("keyup", (e) => {
//     keys[e.keyCode] = false;
// });
