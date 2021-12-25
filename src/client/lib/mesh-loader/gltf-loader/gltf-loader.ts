import { IVector } from "../../../../core/contracts/base/vector";
import VerticiesMode from "../../../constants/verticies-mode";
import { ViewType } from "../../../constants/view-type";
import IMesh from "../../../contracts/mesh";
import GLTFDataType from "../../constants/mesh-loader/gltf-loader/data-type";
import GLTFPrimitiveMode from "../../constants/mesh-loader/gltf-loader/primitive-mode";
import IGLTFBinary from "../../contracts/mesh-loader/gltf-loader/gltf-binary";
import { IGLTFStorage, GLTFAccessor, IGLTFBufferView, IGLTFBuffer } from "../../contracts/mesh-loader/gltf-loader/gltf-types";
import IMeshLoader from "../../contracts/mesh-loader/mesh-loader";

class GLTFLoader implements IMeshLoader {
    private binaries: Array<IGLTFBinary>;

    constructor() {
        this.binaries = [];
    }

    loadBinaries(binaries: Array<IGLTFBinary>) {
        this.binaries = binaries;
    }

    parseGLB(view: DataView): Array<IMesh> {
        // TODO: Add GLB parser
        return [];
    }

    parseGLTF(storage: IGLTFStorage): Array<IMesh> {
        let meshes: Array<IMesh> = [];

        if(storage.meshes) {
            // Parse meshes

            for(let i = 0; i < storage.meshes.length; i++) {
                // Parse primitives

                for(let j = 0; j < storage.meshes[i].primitives.length; j++) {
                    let mesh: IMesh;

                    let points: Array<IVector> = [];
                    let indices: Array<number> = [];

                    // Access verticies buffer
                    const accessor1: GLTFAccessor = storage.accessors[storage.meshes[i].primitives[j].attributes.POSITION];
                    
                    // Check for data type
                    if(accessor1.componentType !== GLTFDataType.FLOAT) {
                        let type: "SIGNED BYTE" | "UNSIGNED BYTE" | "SIGNED SHORT" | "UNSIGNED SHORT" | "UNSIGNED INT";

                        switch(accessor1.componentType) {
                            case GLTFDataType.SIGNED_BYTE: {
                                type = "SIGNED BYTE";
                                break;
                            }
                            case GLTFDataType.UNSIGNED_BYTE: {
                                type = "UNSIGNED BYTE";
                                break;
                            }
                            case GLTFDataType.SIGNED_SHORT: {
                                type = "SIGNED SHORT";
                                break;
                            }
                            case GLTFDataType.UNSIGNED_SHORT: {
                                type = "UNSIGNED SHORT";
                                break;
                            }
                            case GLTFDataType.UNSIGNED_INT: {
                                type = "UNSIGNED INT";
                                break;
                            }
                            default: {
                                throw new Error(`Unknown accessor data type "${accessor1.componentType}".`);
                            }
                        }
                        throw new Error(`Unexpected accessor data type "${type}".`);
                    }
                    
                    const bufferView1: IGLTFBufferView = storage.bufferViews[accessor1.bufferView];
                    const buffer1: IGLTFBuffer = storage.buffers[bufferView1.buffer];

                    let pointsBinary: Float32Array;

                    if(bufferView1.byteStride) {
                        let newBuffer = new Uint8Array(accessor1.count * 3 * 4);
                        let oldBuffer = new Uint8Array(buffer1.slice((bufferView1.byteOffset || 0) + (accessor1.byteOffset || 0)));

                        for(let i = 0; i < accessor1.count * 3 * 4; i++) {
                            newBuffer[i] = oldBuffer[i * (bufferView1.byteStride + 1)];
                        }

                        pointsBinary = new Float32Array(newBuffer, 0, accessor1.count);
                    } else {
                        let buffer: ArrayBuffer;

                        if(buffer1.uri) {
                            // Search for file
                            for(let k = 0; k < this.binaries.length; k++) {
                                if(buffer1.uri === this.binaries[k].name) {
                                    buffer = this.binaries[k].data;
                                }
                            }
                        } else {
                            buffer = this.binaries[0].data;
                        }

                        pointsBinary = new Float32Array(buffer.slice((bufferView1.byteOffset || 0) + (accessor1.byteOffset || 0)), 0, accessor1.count * 3);
                    }

                    if(storage.meshes[i].primitives[j].indices) {
                        // Access indices buffer
                        const accessor2: GLTFAccessor = storage.accessors[storage.meshes[i].primitives[j].attributes.POSITION];
                        const bufferView2: IGLTFBufferView = storage.bufferViews[accessor2.bufferView];
                        const buffer2: IGLTFBuffer = storage.buffers[bufferView2.buffer];

                        let indicesBinary: Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Float32Array;
                        let elementSize: 1 | 2 | 4;
                        let arrayType: Uint8ArrayConstructor | Int8ArrayConstructor | Uint16ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor;

                        switch(accessor2.componentType) {
                            case GLTFDataType.UNSIGNED_BYTE: {
                                arrayType = Uint8Array;
                                elementSize = 1;
                                break;
                            }

                            case GLTFDataType.UNSIGNED_SHORT: {
                                arrayType = Uint16Array;
                                elementSize = 2;
                                break;
                            }

                            case GLTFDataType.UNSIGNED_INT: {
                                arrayType = Uint32Array;
                                elementSize = 4;
                                break;
                            }
                            // Unusual types
                            case GLTFDataType.SIGNED_BYTE: {
                                arrayType = Int8Array;
                                elementSize = 1;
                                console.warn("Ultra3.GLTFLoader: Unexpected data type \"SIGNED BYTE\" for indices.");
                                break;
                            }

                            case GLTFDataType.SIGNED_SHORT: {
                                arrayType = Int16Array;
                                elementSize = 2;
                                console.warn("Ultra3.GLTFLoader: Unexpected data type \"SIGNED SHORT\" for indices.");
                                break;
                            }

                            case GLTFDataType.FLOAT: {
                                arrayType = Float32Array;
                                elementSize = 4;
                                console.warn("Ultra3.GLTFLoader: Unexpected data type \"FLOAT\" for indices.");
                                break;
                            }

                            default: {
                                throw new Error(`Unknown data type ${accessor2.componentType}`);
                            }
                        }

                        if(bufferView1.byteStride) {
                            let newBuffer = new Uint8Array(accessor2.count * elementSize);
                            let oldBuffer = new Uint8Array(buffer2.slice((bufferView1.byteOffset || 0) + (accessor2.byteOffset || 0)));

                            for(let i = 0; i < accessor2.count * elementSize; i++) {
                                newBuffer[i] = oldBuffer[i * (bufferView1.byteStride + 1)];
                            }

                            indicesBinary = new arrayType(newBuffer);
                        } else {
                            indicesBinary = new arrayType(buffer2.slice((bufferView2.byteOffset || 0) + (accessor2.byteOffset || 0)), 0, accessor2.count);
                        }

                        for(let k = 0; k < accessor1.count; k++) {
                            indices.push(indicesBinary[k]);
                        }
                    } else {
                        for(let k = 0; k < accessor1.count; k++) {
                            indices.push(k);
                        }
                    }

                    // Parse verticies
                    let verticiesMode: VerticiesMode;

                    switch(storage.meshes[i].primitives[j].mode) {
                        // Support only for triangles
                        case undefined:
                        case GLTFPrimitiveMode.TRIANGLES: {
                            verticiesMode = VerticiesMode.TRIANGLES;
                            break;
                        }

                        case GLTFPrimitiveMode.TRIANGLE_FAN: {
                            verticiesMode = VerticiesMode.TRIANGLE_FAN;
                            break;
                        }

                        case GLTFPrimitiveMode.TRIANGLE_STRIP: {
                            verticiesMode = VerticiesMode.TRIANGLE_STRIP;
                            break;
                        }

                        default: {
                            let type = "";

                            switch(storage.meshes[i].primitives[j].mode) {
                                case GLTFPrimitiveMode.LINES: {
                                    type = "LINES"
                                    break;
                                }
                                case GLTFPrimitiveMode.LINE_LOOP: {
                                    type = "LINE_LOOP"
                                    break;
                                }
                                case GLTFPrimitiveMode.LINE_STRIP: {
                                    type = "LINE_STRIP"
                                    break;
                                }
                                case GLTFPrimitiveMode.POINTS: {
                                    type = "POINTS"
                                    break;
                                }
                            }

                            throw new Error(`Unsupported type "${type}" (${storage.meshes[i].primitives[j].mode}) in GLTF model.`);
                        }
                    }

                    for(let k = 0; k < accessor1.count; k++) {
                        points.push({
                            x: pointsBinary[k * 3],
                            y: pointsBinary[k * 3 + 1],
                            z: pointsBinary[k * 3 + 2]
                        });
                    }

                    mesh = {
                        castsShadow: true,
                        verticiesMode: verticiesMode,

                        verticies: points,
                        indices: indices,
                        normals: [],
                        uvs: [],

                        pos: {
                            x: 0, 
                            y: 0, 
                            z: 0
                        },
                        scale: {
                            x: 1, 
                            y: 1, 
                            z: 1
                        },
                        rotation: {
                            x: 0, 
                            y: 0, 
                            z: 0
                        },

                        material: null
                    }

                    // TODO: Add normals and uvs parsing

                    // TODO: Add material parsing

                    meshes.push(mesh);
                }
            }
        }

        return meshes;
    }

    loadMeshes(buffer: ArrayBuffer, binaries?: Array<IGLTFBinary>): Array<IMesh> {  
        let view = new DataView(buffer);
        let meshes: Array<IMesh> = [];

        let magic = view.getUint32(0);

        if(binaries) {
            this.binaries = binaries;
        }

        if(magic === 0x46546C67) {
            // GLB format
            meshes = this.parseGLB(view);
        } else if(view.getUint8(0) === 0x7b) { // view.getUint8(0) === '{'
            // GLTF format
            let jsonstring = '{';

            for(let i = 1; i < view.byteLength; i++) {
                jsonstring += String.fromCharCode(view.getUint8(i));
            }

            meshes = this.parseGLTF(JSON.parse(jsonstring) as IGLTFStorage);
        }

        return meshes;
    }
}

export default GLTFLoader;