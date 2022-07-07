#version 100
precision highp float;

uniform sampler2D textureSampler;

varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(textureSampler, vUv, 0.0);
}