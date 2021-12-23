#define MAX_RAYSTEPS    50

precision highp float;
precision highp sampler3D;

uniform vec3 cameraPosition;
uniform sampler3D volume;
uniform int raySteps;
uniform float boxSize;
varying vec3 pos;

vec2 box( in vec3 ro, in vec3 rd, vec3 boxSize ) 
{
    vec3 m = 1.0/rd; // can precompute if traversing a set of aligned boxes
    vec3 n = m*ro;   // can precompute if traversing a set of aligned boxes
    vec3 k = abs(m)*boxSize;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
    float tN = max( max( t1.x, t1.y ), t1.z );
    float tF = min( min( t2.x, t2.y ), t2.z );
    if( tN>tF || tF<0.0) return vec2(-1.0); // no intersection
    return vec2( tN, tF );
}

vec3 lerp(vec3 a, vec3 b, float i) {
    return a + (b - a) * i;
}

void main(void) {
    vec3 dir = normalize(cameraPosition-pos);
    vec2 res = box(pos, dir, vec3(boxSize));

    vec3 rayStart = pos;
    vec3 rayStop = rayStart + dir * res.y;
    int steps = min(raySteps, MAX_RAYSTEPS);

    vec4 color = vec4(0.0);

    for(int i = 0; i < MAX_RAYSTEPS; i++)
    {
        if(i == raySteps) {
            break;
        }

        vec3 rayPos = lerp(rayStart, rayStop, float(i) / float(steps));
        vec4 rgba = texture(volume, rayPos / boxSize * 0.5 + 0.5);
        color += vec4(rgba.rgb, rgba.a);
    }

    color.a *= 1.0 - 1.0 / distance(rayStart, rayStop);

    gl_FragColor = color;
}