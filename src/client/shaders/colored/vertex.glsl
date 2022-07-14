#version 100
precision highp float;
attribute vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 worldViewMatrix;
uniform vec3 color;

varying vec3 matColor;

void main(){
    matColor = color;
    
    gl_Position = projectionMatrix * worldViewMatrix * vec4(position, 1.);
}