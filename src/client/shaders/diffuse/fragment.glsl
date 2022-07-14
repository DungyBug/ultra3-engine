
#version 100
precision highp float;

#define MAX_POINT_LIGHTS_COUNT 128
#define MAX_SPOT_LIGHTS_COUNT 128

uniform sampler2D textureSampler;
uniform vec3 pointLightPositions[MAX_POINT_LIGHTS_COUNT];
uniform vec4 pointLightColors[MAX_POINT_LIGHTS_COUNT];
uniform int pointLightsCount;
uniform vec3 spotLightPositions[MAX_SPOT_LIGHTS_COUNT];
uniform vec4 spotLightColors[MAX_SPOT_LIGHTS_COUNT];
uniform vec3 spotLightDirections[MAX_SPOT_LIGHTS_COUNT];
uniform vec2 spotLightAngles[MAX_SPOT_LIGHTS_COUNT];
uniform int spotLightsCount;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

void main() {
    vec3 diffuse = vec3(0.0);

    for(int i = 0; i < MAX_POINT_LIGHTS_COUNT; i++) {
        if(i >= pointLightsCount)
            break;
            
        diffuse += pointLightColors[i].rgb * max(0.0, dot(vNormal, normalize(pointLightPositions[i] - vPos))) / distance(pointLightPositions[i], vPos) * pointLightColors[i].a;
    }

    for(int i = 0; i < MAX_SPOT_LIGHTS_COUNT; i++) {
        if(i >= spotLightsCount)
            break;

        vec3 toLightDir = normalize(spotLightPositions[i] - vPos);
        float outerAngle = spotLightAngles[i].x;    
        float innerAngle = spotLightAngles[i].y;    
        
        float spotCoefficient = clamp(1.0 - (abs(acos(dot(-spotLightDirections[i], toLightDir))) - innerAngle) / (outerAngle - innerAngle), 0.0, 1.0);
        diffuse += spotLightColors[i].rgb * max(0.0, dot(vNormal, normalize(spotLightPositions[i] - vPos))) / distance(spotLightPositions[i], vPos) * spotLightColors[i].a * spotCoefficient;
    }

    gl_FragColor = texture2D(textureSampler, vUv, 0.0) * vec4(diffuse, 1.0);
}