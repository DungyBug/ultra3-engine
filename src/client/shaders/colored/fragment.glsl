#version 100
precision highp float;

varying vec3 matColor;

void main() {
    gl_FragColor = vec4(matColor, 1.0);
}