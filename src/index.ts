import { World } from './world';
import { Player } from "./entities/player";
import { ExplosiveEntity } from "./entities/explosive";

let world = new World();
let player1 = new Player({
    classname: "player",
    pos: {
        x: 1.0285,
        y: 0,
        z: -0.48562
    }
}, world);
let player2 = new Player({
    classname: "player",
    pos: {
        x: -0.100747,
        y: 0.745331,
        z: 2.02677
    }
}, world);

let explosive = new ExplosiveEntity({
    classname: "grenade",
    physicalModel: "grenade_phys",
    model: "grenade",
    shader: {
        fragmentShader: "",
        vertexShader: "",
        params: [],
        name: "default"
    },
    explodeRadius: 2.23,
    explodeDamage: 120,
    pos: {
        x: -0.02562,
        y: 0.33542,
        z: 0.00256
    }
}, world);

explosive.explode();

let colors = [
    "#ffffff",
    "#ffff00",
    "#ff6000",
    "#ff3000",
    "#ff0000"
];

console.log("Damage caused:");
console.log("\tPlayer 1: %c %i %c damage", `background: ${colors[Math.floor((100 - player1.health) / 20)]}; color: #555`, 100 - player1.health, "background: none; color: black");
console.log("\tPlayer 2: %c %i %c damage", `background: ${colors[Math.floor((100 - player2.health) / 20)]}; color: #555`, 100 - player2.health, "background: none; color: black");

