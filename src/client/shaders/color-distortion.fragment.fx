#ifdef GL_ES
    precision highp float;
#endif

precision highp float;

varying vec2 vUV;

uniform sampler2D textureSampler;
uniform float coefficient;
uniform float step;

vec2 moveFromCenter(vec2 a, float coefficient) {
    vec2 o = a - 0.5;
    o *= coefficient;
    return o + 0.5;
}

void main(void) {
    float dist = distance(vUV, vec2(0.5, 0.5));
    float coef = floor(coefficient);
    if(coef < 0.0f) {
        coef = -coef;
    }
    vec2 uv = moveFromCenter(vUV, 1.0 - dist * 0.1f * coefficient);

    float r = texture2D(textureSampler, moveFromCenter(uv, 1.0 + dist * 0.015), dist * 4.0f).r;
    float b = texture2D(textureSampler, moveFromCenter(uv, 1.0 - dist * 0.015), dist * 4.0f).b;

    for(float i = 1.0f; i < coef + 1.0f; i += step) {
        r += texture2D(textureSampler, moveFromCenter(uv, 1.0 + dist * i * r * 0.015), dist * 4.0f * i / coef).r;
        b += texture2D(textureSampler, moveFromCenter(uv, 1.0 - dist * i * b * 0.015), dist * 4.0f * i / coef).b;
    }

    r /= coef / step + 1.0f;
    b /= coef / step + 1.0f;

    vec4 color = vec4(r, texture2D(textureSampler, uv, dist * 4.0f).g, b , 1.0);
    gl_FragColor = color;
}