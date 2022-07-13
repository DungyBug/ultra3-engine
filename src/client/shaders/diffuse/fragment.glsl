
#version 100
precision highp float;

#define MAX_LIGHTS_COUNT 128

uniform sampler2D textureSampler;
uniform vec3 lights[MAX_LIGHTS_COUNT];
uniform vec4 lightColors[MAX_LIGHTS_COUNT];
uniform int lightsCount;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

void main() {
    vec3 diffuse = vec3(0.0);

    for(int i = 0; i < MAX_LIGHTS_COUNT; i++) {
        if(i >= lightsCount)
            break;
            
        diffuse += lightColors[i].rgb * max(0.0, dot(vNormal, normalize(lights[i] - vPos))) / distance(lights[i], vPos) * lightColors[i].a;
    }

    gl_FragColor = texture2D(textureSampler, vUv, 0.0) * vec4(diffuse, 1.0);
}