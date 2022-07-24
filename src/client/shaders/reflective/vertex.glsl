#version 100
precision highp float;
attribute vec3 position;
attribute vec3 u3Normal;
uniform mat4 projectionMatrix;
uniform mat4 worldViewMatrix;
uniform mat4 modelViewMatrix;
uniform vec3 cameraPosition;

varying vec3 vUv;

void main() {
    vec3 pos = vec3(modelViewMatrix * vec4(position, 1.0));
    vec3 normal = normalize(vec3(modelViewMatrix * vec4(u3Normal, 0.0)));
    vec3 viewDir = normalize(cameraPosition + pos);
    vUv = reflect(viewDir, normal);
    gl_Position = projectionMatrix * worldViewMatrix * vec4(position, 1.0);
}