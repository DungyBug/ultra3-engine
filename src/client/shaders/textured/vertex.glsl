#version 100
precision highp float;
attribute vec3 position;
attribute vec2 u3Uv;
uniform mat4 projectionMatrix;
uniform mat4 worldViewMatrix;

varying vec2 vUv;

void main() {
    vUv = u3Uv;
    gl_Position = projectionMatrix * worldViewMatrix * vec4(position, 1.0);
}