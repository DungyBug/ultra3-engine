#ifdef GL_ES
    precision highp float;
#endif

#define LODS_COUNT 5 // Count of downsizes

varying vec2 vUV;
uniform sampler2D textureSampler; // Texture of screen
uniform float bloomWeight; // Weight of bloom ( or radius of blur )
uniform float bloomCoefficient; // Coefficient of bloom to apply on screen
uniform vec2 screenSize; // Size of screen in pixels
uniform float quality; // Quality of bloom

//---------------------------------------------------------------------------
vec4 sblur(float r, vec2 screen, vec2 pos, float lod)
    {
    float x,y,xx,yy,rr=r*r,dx,dy,w,w0;
    w0=0.3780/(r * r);
    vec2 p;
    vec4 col=vec4(0.0,0.0,0.0,0.0);
    for (dx=1.0/screen.x,x=-r,p.x=0.5+(pos.x*0.5)+(x*dx);x<=r;x++,p.x+=dx){ xx=x*x;
    for (dy=1.0/screen.y,y=-r,p.y=0.5+(pos.y*0.5)+(y*dy);y<=r;y++,p.y+=dy){ yy=y*y;
    if (xx+yy<=rr)
        {
        w=w0*exp((-xx-yy)/(1.5*rr));
        col+=max(texture2D(textureSampler,p, lod) - vec4(1.0, 1.0, 1.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))*w;
        }}}
    return col;
}

vec3 blur(float blurWidth, float lod) {
    vec3 color = vec3(0.0, 0.0, 0.0);

    color = sblur(blurWidth * quality, screenSize / lod * quality, vUV * 2.0 - 1.0, lod).rgb;

    return color;
}

void main(void) {
    vec3 bloom = vec3(0.0, 0.0, 0.0);
    vec4 color = texture2D(textureSampler, vUV);
    vec3 firstBloom = blur(bloomWeight * 1.2, float(3.0));

    float grayscale1 = (firstBloom.r + firstBloom.g + firstBloom.b);
    float grayscale2 = max((color.r + color.g + color.b) - 1.0, 0.0);
    if(grayscale1 == 0.0 && grayscale2 == 0.0) {
        gl_FragColor = color;
        return;
    }

    for(int i = LODS_COUNT; i > 0; i--) {
        if(i < LODS_COUNT) {
            bloom = (bloom + blur(bloomWeight, float(i))) * 0.5;
        } else {
            bloom = firstBloom;
        }
    }
    
    gl_FragColor = color + vec4(bloom, 1.0) * bloomCoefficient;
}