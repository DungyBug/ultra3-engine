#version 100
precision highp float;
attribute vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 worldViewMatrix;

void main() {
    gl_Position = projectionMatrix * worldViewMatrix * vec4(position, 1.0);
}