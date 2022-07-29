#version 100
precision highp float;
uniform sampler2D textureSampler;
uniform vec2 screenSize;

void main() {
    gl_FragColor = texture2D(textureSampler, gl_FragCoord.xy / screenSize);
}