import { IVector } from "../../../../core/contracts/base/vector";
import IVector2D from "../../../../core/contracts/base/vector2d";
import VerticesMode from "../../../constants/verticies-mode";
import IMesh from "../../../contracts/mesh";
import GLTFDataType from "../../constants/mesh-loader/gltf-loader/data-type";
import GLTFPrimitiveMode from "../../constants/mesh-loader/gltf-loader/primitive-mode";
import IGLTFBinary from "../../contracts/mesh-loader/gltf-loader/gltf-binary";
import { IGLTFStorage, GLTFAccessor, IGLTFBufferView, IGLTFBuffer } from "../../contracts/mesh-loader/gltf-loader/gltf-types";
import IMeshLoader from "../../contracts/mesh-loader/mesh-loader";

// Helper function
function convertToFloat(array: Uint8Array | Uint16Array | Uint32Array): Float32Array {
    let floatArray = new Float32Array(array.length);

    for(let i = 0; i < array.length; i++) {
        floatArray[i] = array[i] / (256 ** array.BYTES_PER_ELEMENT - 1);
    }

    return floatArray;
}

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

    accessBuffer(buffer: `${string}.bin` | `${string}.glbin` | `${string}.glbuf` | `data:application/octet-stream;base64,${string}` | `data:application/gltf-buffer;base64,${string}`): ArrayBuffer {
        if(buffer.startsWith("data:application/octet-stream;base64,") || buffer.startsWith("data:application/gltf-buffer;base64,")) {
            // Parse Base64 buffer

            let binaryString: string;

            if(buffer.startsWith("data:application/octet-stream;base64,")) {
                binaryString = atob(buffer.slice(37));
            } else {
                binaryString = atob(buffer.slice(36));
            }

            const array = new Uint8Array(binaryString.length);

            for(let i = 0; i < binaryString.length; i++) {
                array[i] = binaryString.charCodeAt(i);
            }

            return array.buffer;
        } else {
            // Search file

            for(let i = 0; i < this.binaries.length; i++) {
                if(buffer === this.binaries[i].name) {
                    return this.binaries[i].data;
                }
            }
        }
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

                    /*
                    ***************************************************
                    *              Access vertices buffer             *
                    ***************************************************
                    */
                    const verticesAccessor: GLTFAccessor = storage.accessors[storage.meshes[i].primitives[j].attributes.POSITION];
                    
                    // Check for data type
                    if(verticesAccessor.componentType !== GLTFDataType.FLOAT) {
                        let type: "SIGNED BYTE" | "UNSIGNED BYTE" | "SIGNED SHORT" | "UNSIGNED SHORT" | "UNSIGNED INT";

                        switch(verticesAccessor.componentType) {
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
                                throw new Error(`Unknown accessor data type "${verticesAccessor.componentType}".`);
                            }
                        }
                        throw new Error(`Unexpected accessor data type "${type}".`);
                    }
                    
                    const verticesBufferView: IGLTFBufferView = storage.bufferViews[verticesAccessor.bufferView];
                    const verticesBuffer: IGLTFBuffer = storage.buffers[verticesBufferView.buffer];

                    let pointsBinary: Float32Array;

                    if(verticesBufferView.byteStride) {
                        // Get buffer
                        let buffer: ArrayBuffer;

                        if(verticesBuffer.uri) {
                            buffer = this.accessBuffer(verticesBuffer.uri);
                        } else {
                            buffer = this.binaries[0].data;
                        }

                        let newBuffer = new Uint8Array(verticesAccessor.count * 3 * 4);
                        let oldBuffer = new Uint8Array(buffer.slice((verticesBufferView.byteOffset || 0) + (verticesAccessor.byteOffset || 0)));

                        for(let i = 0; i < verticesAccessor.count * 3 * 4; i++) {
                            newBuffer[i] = oldBuffer[i * (verticesBufferView.byteStride + 1)];
                        }

                        pointsBinary = new Float32Array(newBuffer, 0, verticesAccessor.count);
                    } else {
                        let buffer: ArrayBuffer;

                        if(verticesBuffer.uri) {
                            buffer = this.accessBuffer(verticesBuffer.uri);
                        } else {
                            buffer = this.binaries[0].data;
                        }

                        pointsBinary = new Float32Array(buffer.slice((verticesBufferView.byteOffset || 0) + (verticesAccessor.byteOffset || 0)), 0, verticesAccessor.count * 3);
                    }

                    if(storage.meshes[i].primitives[j].indices !== undefined) {
                        /*
                        ***************************************************
                        *               Access indices buffer             *
                        ***************************************************
                        */
                        const indicesAccessor: GLTFAccessor = storage.accessors[storage.meshes[i].primitives[j].indices];
                        const indicesBufferView: IGLTFBufferView = storage.bufferViews[indicesAccessor.bufferView];
                        const indicesBuffer: IGLTFBuffer = storage.buffers[indicesBufferView.buffer];

                        let indicesBinary: Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Float32Array;
                        let elementSize: 1 | 2 | 4;
                        let arrayType: Uint8ArrayConstructor | Int8ArrayConstructor | Uint16ArrayConstructor | Int16ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor;

                        // Get component type
                        switch(indicesAccessor.componentType) {
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
                                throw new Error(`Unknown data type ${indicesAccessor.componentType}`);
                            }
                        }

                        if(indicesBufferView.byteStride) {
                            // Get buffer
                            let buffer: ArrayBuffer;

                            if(indicesBuffer.uri) {
                                buffer = this.accessBuffer(indicesBuffer.uri);
                            } else {
                                buffer = this.binaries[0].data;
                            }

                            let newBuffer = new Uint8Array(indicesAccessor.count * elementSize);
                            let oldBuffer = new Uint8Array(buffer.slice((indicesBufferView.byteOffset || 0) + (indicesAccessor.byteOffset || 0)));

                            for(let i = 0; i < indicesAccessor.count * elementSize; i++) {
                                newBuffer[i] = oldBuffer[i * (indicesBufferView.byteStride + 1)];
                            }

                            indicesBinary = new arrayType(newBuffer);
                        } else {
                            let buffer: ArrayBuffer;

                            if(indicesBuffer.uri) {
                                buffer = this.accessBuffer(indicesBuffer.uri);
                            } else {
                                // For GLB formats
                                buffer = this.binaries[0].data;
                            }

                            indicesBinary = new arrayType(buffer.slice((indicesBufferView.byteOffset || 0) + (indicesAccessor.byteOffset || 0)), 0, indicesAccessor.count);
                        }

                        for(let k = 0; k < indicesAccessor.count; k++) {
                            indices.push(indicesBinary[k]);
                        }
                    } else {
                        // There is no indices buffer
                        for(let k = 0; k < verticesAccessor.count; k++) {
                            indices.push(k);
                        }
                    }
                    
                    /*
                    ***************************************************
                    *                  Parse vertices                 *
                    ***************************************************
                    */
                    let verticesMode: VerticesMode;

                    // Check for mode support
                    switch(storage.meshes[i].primitives[j].mode) {
                        // Support only for triangles
                        case undefined:
                        case GLTFPrimitiveMode.TRIANGLES: {
                            verticesMode = VerticesMode.TRIANGLES;
                            break;
                        }

                        case GLTFPrimitiveMode.TRIANGLE_FAN: {
                            verticesMode = VerticesMode.TRIANGLE_FAN;
                            break;
                        }

                        case GLTFPrimitiveMode.TRIANGLE_STRIP: {
                            verticesMode = VerticesMode.TRIANGLE_STRIP;
                            break;
                        }

                        // Unsupported type
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

                    for(let k = 0; k < verticesAccessor.count; k++) {
                        points.push({
                            x: pointsBinary[k * 3],
                            y: pointsBinary[k * 3 + 1],
                            z: pointsBinary[k * 3 + 2]
                        });
                    }

                    let normals: Array<IVector> = [];

                    if(storage.meshes[i].primitives[j].attributes.NORMAL !== undefined) {
                        /*
                        ***************************************************
                        *               Access normals buffer             *
                        ***************************************************
                        */
                        const normalsAccessor = storage.accessors[storage.meshes[i].primitives[j].attributes.NORMAL];
                        const normalsBufferView = storage.bufferViews[normalsAccessor.bufferView];
                        const normalsBuffer = storage.buffers[normalsBufferView.buffer];

                        let normalsBinary: Float32Array;

                        if(normalsBufferView.byteStride) {
                            // Get buffer
                            let buffer: ArrayBuffer;

                            if(normalsBuffer.uri) {
                                buffer = this.accessBuffer(normalsBuffer.uri);
                            } else {
                                buffer = this.binaries[0].data;
                            }

                            let newBuffer = new Uint8Array(normalsAccessor.count * 3 * 4);
                            let oldBuffer = new Uint8Array(buffer.slice((normalsBufferView.byteOffset || 0) + (normalsAccessor.byteOffset || 0)));
    
                            for(let i = 0; i < normalsAccessor.count * 3 * 4; i++) {
                                newBuffer[i] = oldBuffer[i * (normalsBufferView.byteStride + 1)];
                            }
    
                            normalsBinary = new Float32Array(newBuffer, 0, normalsAccessor.count);
                        } else {
                            let buffer: ArrayBuffer;
    
                            if(normalsBuffer.uri) {
                                buffer = this.accessBuffer(normalsBuffer.uri);
                            } else {
                                buffer = this.binaries[0].data;
                            }
    
                            normalsBinary = new Float32Array(buffer.slice((normalsBufferView.byteOffset || 0) + (normalsAccessor.byteOffset || 0)), 0, normalsAccessor.count * 3);
                        }

                        for(let i = 0; i < normalsAccessor.count * 3; i += 3) {
                            normals.push({
                                x: normalsBinary[i],
                                y: normalsBinary[i + 1],
                                z: normalsBinary[i + 2]
                            });
                        }
                    }

                    let uvs: Array<IVector2D> = [];

                    if(storage.meshes[i].primitives[j].attributes.TEXCOORD_0 !== undefined) {
                        /*
                        ***************************************************
                        *                 Access UVs buffer               *
                        ***************************************************
                        */

                        const uvsAccessor = storage.accessors[storage.meshes[i].primitives[j].attributes.TEXCOORD_0];
                        const uvsBufferView = storage.bufferViews[uvsAccessor.bufferView];
                        const uvsBuffer = storage.buffers[uvsBufferView.buffer];

                        let uvsBinary: Float32Array;

                        if(uvsBufferView.byteStride) { // No stride support for UVs
                            // Get buffer
                            let buffer: ArrayBuffer;

                            if(uvsBuffer.uri) {
                                buffer = this.accessBuffer(uvsBuffer.uri);
                            } else {
                                buffer = this.binaries[0].data;
                            }

                            let newBuffer = new Uint8Array(uvsAccessor.count * 2);
                            let oldBuffer = new Uint8Array(buffer.slice((uvsBufferView.byteOffset || 0) + (uvsAccessor.byteOffset || 0)));
    
                            for(let i = 0; i < uvsAccessor.count * 2; i++) {
                                newBuffer[i] = oldBuffer[i * (uvsBufferView.byteStride + 1)];
                            }
    
                            uvsBinary = new Float32Array(newBuffer, 0, uvsAccessor.count);
                        } else {
                            let buffer: ArrayBuffer;
    
                            if(uvsBuffer.uri) {
                                buffer = this.accessBuffer(uvsBuffer.uri);
                            } else {
                                buffer = this.binaries[0].data;
                            }

                            switch(uvsAccessor.componentType) {
                                case GLTFDataType.FLOAT: {
                                    uvsBinary = new Float32Array(buffer.slice((uvsBufferView.byteOffset || 0) + (uvsAccessor.byteOffset || 0)), 0, uvsAccessor.count * 2);
                                    break;
                                }
                                case GLTFDataType.UNSIGNED_BYTE: {
                                    uvsBinary = convertToFloat(new Uint8Array(buffer.slice((uvsBufferView.byteOffset || 0) + (uvsAccessor.byteOffset || 0)), 0, uvsAccessor.count * 2))
                                    break;
                                }
                                case GLTFDataType.UNSIGNED_SHORT: {
                                    uvsBinary = convertToFloat(new Uint16Array(buffer.slice((uvsBufferView.byteOffset || 0) + (uvsAccessor.byteOffset || 0)), 0, uvsAccessor.count * 2))
                                    break;
                                }
                                case GLTFDataType.SIGNED_BYTE: {
                                    console.warn("Ultra3.GLTFLoader: Unexpected data type \"SIGNED BYTE\" for UVs.");
                                    break;
                                }
                                case GLTFDataType.SIGNED_SHORT: {
                                    console.warn("Ultra3.GLTFLoader: Unexpected data type \"SIGNED SHORT\" for UVs.");
                                    break;
                                }
                                default:
                                {
                                    throw new Error(`Unknown UVs data type "${uvsAccessor.componentType}".`);
                                }
                            }

                            for(let k = 0; k < uvsBinary.length; k += 2) {
                                uvs.push({
                                    x: uvsBinary[k],
                                    y: uvsBinary[k + 1]
                                });
                            }
                        }
                    }

                    mesh = {
                        castsShadow: true,
                        verticesMode: verticesMode,

                        vertices: points,
                        indices: indices,
                        normals: normals,
                        uvs: uvs,

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