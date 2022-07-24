#version 100
precision highp float;

uniform samplerCube textureSampler;
varying vec3 vUv;

void main() {
    gl_FragColor = textureCube(textureSampler, vUv);
}