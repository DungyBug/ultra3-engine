function create3dNoise(width, height, depth) {
    let noise = new Uint8Array(width * height * depth * 3);
    let i = 0;
    let max = new BABYLON.Vector3(width / 2, height / 2, depth / 2);
    let maxDist = max.length();

    for(let z = 0; z < depth; z++) {
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                let vec = new BABYLON.Vector3(x - width / 2, y - height / 2, z - depth / 2);
                let len = vec.length() / maxDist;
                noise[i * 3] = 255 - len * 255;
                noise[i * 3 + 1] = 255 - len * 255;
                noise[i * 3 + 2] = 255 - len * 255;

                i++;
            }
        }
    }

    return noise;
}

function loadTexture(src) {
    return new Promise(res => {
        let texture = new Image();
        texture.src = src;
        texture.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = texture.width;
            canvas.height = texture.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(texture, 0, 0);

            let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            res(data.data);
        }
    })
}

var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var box = BABYLON.MeshBuilder.CreateBox("box", {size: 5}, scene);

    // Move the sphere upward 1/2 its height
    box.position.y = 1;

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    // Compile shader
    BABYLON.Effect.ShadersStore["customVertexShader"]=
    `
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
    `;

    BABYLON.Effect.ShadersStore["customFragmentShader"]=
    `
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
    `;

    loadTexture("data:image/png;base64,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")
        .then((data) => {
            let texture = new BABYLON.RawTexture3D(data, 32, 32, 32, BABYLON.Engine.TEXTUREFORMAT_RGBA, scene, false, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, BABYLON.Engine.TEXTURETYPE_UNSIGNED_BYTE);

            // Compile
            var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
                    vertex: "custom",
                    fragment: "custom",
                },
                {
                    attributes: ["position"],
                    uniforms: ["worldViewProjection"],
                    needAlphaBlending: true
                }
            );

            shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
            shaderMaterial.setInt("raySteps", 1000);
            shaderMaterial.setFloat("boxSize", 2.5);
            shaderMaterial.setTexture("volume", texture);

            shaderMaterial.backFaceCulling = false;

            box.material = shaderMaterial;

            engine.runRenderLoop(() => {
                shaderMaterial.setVector3("cameraPosition", scene.activeCamera.position);
            });

            // shaderMaterial.alphaMode = BABYLON.Engine.ALPHA_ADD;
        })

    return scene;
};