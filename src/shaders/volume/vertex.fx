precision highp float;

// Attributes
attribute vec3 position;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;

// Varying
varying vec3 pos;

void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
    gl_Position.z *= -1.0;
    pos = position;
}