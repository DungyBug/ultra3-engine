import GLTFDataType from "./client/lib/constants/mesh-loader/gltf-loader/data-type";
import GLTFLoader from "./client/lib/mesh-loader/gltf-loader/gltf-loader";

let loader = new GLTFLoader();

let verticiesArray = new Float32Array(9);
verticiesArray[0] = -1;
verticiesArray[1] = -1;
verticiesArray[2] = -1;
verticiesArray[3] = 0;
verticiesArray[4] = 0;
verticiesArray[5] = 0;
verticiesArray[6] = 1;
verticiesArray[7] = 1;
verticiesArray[8] = 1;

loader.loadBinaries([
    {
        name: "data.bin",
        data: verticiesArray.buffer
    }
])

console.log(loader.parseGLTF({
    asset: {
        version: "2.0"
    },
    meshes: [
        {
            primitives: [
                {
                    attributes: {
                        POSITION: 0
                    }
                }
            ]
        }
    ],
    accessors: [
        {
            bufferView: 0,
            componentType: GLTFDataType.FLOAT,
            count: 3,
            min: [-1, -1, -1],
            max: [1, 1, 1],
            type: "VEC3"
        }
    ],
    bufferViews: [
        {
            buffer: 0,
            byteLength: 32
        }
    ],
    buffers: [
        {
            byteLength: 32,
            uri: "data.bin"
        }
    ]
}));