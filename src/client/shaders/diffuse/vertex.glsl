#version 100
precision highp float;
attribute vec3 position;
attribute vec2 u3Uv;
attribute vec3 u3Normal;
uniform mat4 projectionMatrix;
uniform mat4 worldViewMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

void main() {
    vUv = u3Uv;
    vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize((modelViewMatrix * vec4(u3Normal, 0.0)).xyz);
    gl_Position = projectionMatrix * worldViewMatrix * vec4(position, 1.0);
}