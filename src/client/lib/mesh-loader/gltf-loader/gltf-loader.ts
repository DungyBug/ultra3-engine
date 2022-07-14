import { IVector } from "../../../../core/contracts/base/vector";
import IVector2D from "../../../../core/contracts/base/vector2d";
import ColorMode from "../../../constants/color-mode";
import SamplingMode from "../../../constants/sampling-mode";
import TextureFormat from "../../../constants/texture-format";
import VerticesMode from "../../../constants/verticies-mode";
import IMaterial from "../../../contracts/material";
import IMesh from "../../../contracts/mesh";
import { IUint8TextureOptions } from "../../../contracts/texture/texture-opts";
import ITexture2D from "../../../contracts/texture/texture2d";
import Texture2D from "../../../texture/texture2d";
import GLTFDataType from "../../constants/mesh-loader/gltf-loader/data-type";
import GLTFPrimitiveMode from "../../constants/mesh-loader/gltf-loader/primitive-mode";
import IGLTFBinary from "../../contracts/mesh-loader/gltf-loader/gltf-binary";
import {
    IGLTFStorage,
    GLTFAccessor,
    IGLTFBufferView,
    IGLTFBuffer,
    GLTFImage,
} from "../../contracts/mesh-loader/gltf-loader/gltf-types";
import IMeshLoader from "../../contracts/mesh-loader/mesh-loader";
import { convertToFloat } from "./gltf-helper-functions";
import GLTFMipMappedTextureFilter, {
    GLTFUnMipMappedTextureFilter,
} from "../../constants/mesh-loader/gltf-loader/texture-filter";
import PBRMaterial from "../../../materials/pbr-material";
import IGLTFChunk from "../../contracts/mesh-loader/gltf-loader/gltf-chunk";
import IScene from "../../../contracts/scene";
import ILight from "../../../contracts/entities/light";
import LightEntity from "../../../entities/light";
import { World } from "../../../../core/world";
import DrawMode from "../../../constants/draw-mode";
import ClientEngine from "../../../client-engine";

class GLTFLoader implements IMeshLoader {
    private binaries: Array<IGLTFBinary>;
    private images: Record<
        string,
        {
            data: Uint8Array;
            width: number;
            height: number;
        }
    >;
    private world: World;
    private engine: ClientEngine;

    constructor(world: World, engine: ClientEngine = null) {
        this.binaries = [];
        this.images = {};
        this.world = world;
        this.engine = engine;
    }

    loadBinaries(binaries: Array<IGLTFBinary>) {
        this.binaries = binaries;
    }

    /**
     * Parses GLB file, loads all external files and internal binary.
     *
     * @param buffer - Binary data represented in ArrayBuffer
     * @returns JSON object ( GLTFStorage ), taken from GLB file ( buffer ).
     */
    loadGLB(buffer: ArrayBuffer): IGLTFStorage {
        const view = new DataView(buffer.slice(4)); // Skip magic "glTF"
        let currentOffset = 0;

        const version = view.getUint32(currentOffset);
        currentOffset += 4;

        if (version !== 0x02000000) {
            console.warn(
                `Ultra3.GLTFLoader: Unexpected version ${version} for GLB file. File may be interpreted incorrectly.`
            );
        }

        const length = view.getUint32(currentOffset, true);
        currentOffset += 4;

        let storage: IGLTFStorage;

        /*
         *********************************************
         *                Parse chunks               *
         *********************************************
         */
        const chunks: Array<IGLTFChunk> = [];
        let totalLength = 0;

        while (totalLength < length - 28) {
            // Read header

            const chunkLength = view.getUint32(currentOffset, true);
            currentOffset += 4;

            const chunkType = view.getUint32(currentOffset);
            currentOffset += 4;

            totalLength += chunkLength;

            switch (chunkType) {
                case 0x4a534f4e: // JSON chunk
                case 0x42494e00: {
                    // BIN chunk
                    chunks.push({
                        chunkType,
                        chunkData: new Uint8Array(
                            buffer.slice(currentOffset + 4),
                            0,
                            chunkLength
                        ),
                        chunkLength,
                    });
                    currentOffset += chunkLength;
                    break;
                }

                default: {
                    console.warn(
                        `Ultra3.GLTFLoader: Unknown chunk type "${chunkType}".`
                    );
                }
            }
        }

        const decoder = new TextDecoder();

        storage = JSON.parse(decoder.decode(chunks[0].chunkData)); // First chunk is always GLTF storage.

        if (chunks[1]) {
            // Second chunk is always internal binary or undefined
            this.loadBinaries([
                {
                    name: "",
                    data: chunks[1].chunkData.buffer,
                },
            ]);
        }

        return storage;
    }

    accessBuffer(
        buffer:
            | `${string}.bin`
            | `${string}.glbin`
            | `${string}.glbuf`
            | `data:application/octet-stream;base64,${string}`
            | `data:application/gltf-buffer;base64,${string}`
    ): ArrayBuffer {
        if (
            buffer.startsWith("data:application/octet-stream;base64,") ||
            buffer.startsWith("data:application/gltf-buffer;base64,")
        ) {
            // Parse Base64 buffer

            let binaryString: string;

            if (buffer.startsWith("data:application/octet-stream;base64,")) {
                binaryString = atob(buffer.slice(37));
            } else {
                binaryString = atob(buffer.slice(36));
            }

            const array = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
                array[i] = binaryString.charCodeAt(i);
            }

            return array.buffer;
        } else {
            // Search file

            for (let i = 0; i < this.binaries.length; i++) {
                if (buffer === this.binaries[i].name) {
                    return this.binaries[i].data;
                }
            }
        }
    }

    accessImage(src: string) {
        return this.images[src];
    }

    loadImage(name: string, data: Uint8Array, width: number, height: number) {
        this.images[name] = {
            data,
            width,
            height,
        };
    }

    parseGLTF(storage: IGLTFStorage): IScene {
        let meshes: Array<IMesh> = [];
        let lights: Array<ILight> = [];

        if (storage.nodes) {
            // Parse meshes
            for (let i = 0; i < storage.nodes.length; i++) {
                if (storage.nodes[i].mesh !== undefined) {
                    /*
                     ***************************************
                     *           Parse mesh node           *
                     ***************************************
                     */

                    // Parse primitives
                    for (
                        let j = 0;
                        j <
                        storage.meshes[storage.nodes[i].mesh].primitives.length;
                        j++
                    ) {
                        let mesh: IMesh;
                        let points: Array<IVector> = [];
                        let indices: Array<number> = [];

                        /*
                         ***************************************************
                         *              Access vertices buffer             *
                         ***************************************************
                         */
                        const verticesAccessor: GLTFAccessor =
                            storage.accessors[
                                storage.meshes[storage.nodes[i].mesh]
                                    .primitives[j].attributes.POSITION
                            ];

                        // Check for data type
                        if (
                            verticesAccessor.componentType !==
                            GLTFDataType.FLOAT
                        ) {
                            let type:
                                | "SIGNED BYTE"
                                | "UNSIGNED BYTE"
                                | "SIGNED SHORT"
                                | "UNSIGNED SHORT"
                                | "UNSIGNED INT";

                            switch (verticesAccessor.componentType) {
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
                                    throw new Error(
                                        `Unknown accessor data type "${verticesAccessor.componentType}".`
                                    );
                                }
                            }
                            throw new Error(
                                `Unexpected accessor data type "${type}".`
                            );
                        }

                        const verticesBufferView: IGLTFBufferView =
                            storage.bufferViews[verticesAccessor.bufferView];
                        const verticesBuffer: IGLTFBuffer =
                            storage.buffers[verticesBufferView.buffer];
                        let pointsBinary: Float32Array;

                        if (verticesBufferView.byteStride) {
                            // Get buffer
                            let buffer: ArrayBuffer;

                            if (verticesBuffer.uri) {
                                buffer = this.accessBuffer(verticesBuffer.uri);
                            } else {
                                buffer = this.binaries[0].data;
                            }

                            let newBuffer = new Uint8Array(
                                verticesAccessor.count * 3 * 4
                            );
                            let oldBuffer = new Uint8Array(
                                buffer.slice(
                                    (verticesBufferView.byteOffset || 0) +
                                        (verticesAccessor.byteOffset || 0)
                                )
                            );

                            for (
                                let i = 0;
                                i < verticesAccessor.count * 3 * 4;
                                i++
                            ) {
                                newBuffer[i] =
                                    oldBuffer[
                                        i * (verticesBufferView.byteStride + 1)
                                    ];
                            }

                            pointsBinary = new Float32Array(
                                newBuffer,
                                0,
                                verticesAccessor.count
                            );
                        } else {
                            let buffer: ArrayBuffer;

                            if (verticesBuffer.uri) {
                                buffer = this.accessBuffer(verticesBuffer.uri);
                            } else {
                                buffer = this.binaries[0].data;
                            }

                            pointsBinary = new Float32Array(
                                buffer.slice(
                                    (verticesBufferView.byteOffset || 0) +
                                        (verticesAccessor.byteOffset || 0)
                                ),
                                0,
                                verticesAccessor.count * 3
                            );
                        }

                        if (
                            storage.meshes[storage.nodes[i].mesh].primitives[j]
                                .indices !== undefined
                        ) {
                            /*
                             ***************************************************
                             *               Access indices buffer             *
                             ***************************************************
                             */
                            const indicesAccessor: GLTFAccessor =
                                storage.accessors[
                                    storage.meshes[storage.nodes[i].mesh]
                                        .primitives[j].indices
                                ];
                            const indicesBufferView: IGLTFBufferView =
                                storage.bufferViews[indicesAccessor.bufferView];
                            const indicesBuffer: IGLTFBuffer =
                                storage.buffers[indicesBufferView.buffer];
                            let indicesBinary:
                                | Uint8Array
                                | Uint16Array
                                | Uint32Array
                                | Int8Array
                                | Int16Array
                                | Float32Array;
                            let elementSize: 1 | 2 | 4;
                            let arrayType:
                                | Uint8ArrayConstructor
                                | Int8ArrayConstructor
                                | Uint16ArrayConstructor
                                | Int16ArrayConstructor
                                | Uint32ArrayConstructor
                                | Float32ArrayConstructor;

                            // Get component type
                            switch (indicesAccessor.componentType) {
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
                                    console.warn(
                                        'Ultra3.GLTFLoader: Unexpected data type "SIGNED BYTE" for indices.'
                                    );
                                    break;
                                }

                                case GLTFDataType.SIGNED_SHORT: {
                                    arrayType = Int16Array;
                                    elementSize = 2;
                                    console.warn(
                                        'Ultra3.GLTFLoader: Unexpected data type "SIGNED SHORT" for indices.'
                                    );
                                    break;
                                }

                                case GLTFDataType.FLOAT: {
                                    arrayType = Float32Array;
                                    elementSize = 4;
                                    console.warn(
                                        'Ultra3.GLTFLoader: Unexpected data type "FLOAT" for indices.'
                                    );
                                    break;
                                }

                                default: {
                                    throw new Error(
                                        `Unknown data type ${indicesAccessor.componentType}`
                                    );
                                }
                            }

                            if (indicesBufferView.byteStride) {
                                // Get buffer
                                let buffer: ArrayBuffer;

                                if (indicesBuffer.uri) {
                                    buffer = this.accessBuffer(
                                        indicesBuffer.uri
                                    );
                                } else {
                                    buffer = this.binaries[0].data;
                                }

                                let newBuffer = new Uint8Array(
                                    indicesAccessor.count * elementSize
                                );
                                let oldBuffer = new Uint8Array(
                                    buffer.slice(
                                        (indicesBufferView.byteOffset || 0) +
                                            (indicesAccessor.byteOffset || 0)
                                    )
                                );

                                for (
                                    let i = 0;
                                    i < indicesAccessor.count * elementSize;
                                    i++
                                ) {
                                    newBuffer[i] =
                                        oldBuffer[
                                            i *
                                                (indicesBufferView.byteStride +
                                                    1)
                                        ];
                                }

                                indicesBinary = new arrayType(newBuffer);
                            } else {
                                let buffer: ArrayBuffer;

                                if (indicesBuffer.uri) {
                                    buffer = this.accessBuffer(
                                        indicesBuffer.uri
                                    );
                                } else {
                                    // For GLB formats
                                    buffer = this.binaries[0].data;
                                }

                                indicesBinary = new arrayType(
                                    buffer.slice(
                                        (indicesBufferView.byteOffset || 0) +
                                            (indicesAccessor.byteOffset || 0)
                                    ),
                                    0,
                                    indicesAccessor.count
                                );
                            }

                            for (let k = 0; k < indicesAccessor.count; k++) {
                                indices.push(indicesBinary[k]);
                            }
                        } else {
                            // There is no indices buffer
                            for (let k = 0; k < verticesAccessor.count; k++) {
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
                        switch (
                            storage.meshes[storage.nodes[i].mesh].primitives[j]
                                .mode
                        ) {
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

                                switch (
                                    storage.meshes[storage.nodes[i].mesh]
                                        .primitives[j].mode
                                ) {
                                    case GLTFPrimitiveMode.LINES: {
                                        type = "LINES";
                                        break;
                                    }
                                    case GLTFPrimitiveMode.LINE_LOOP: {
                                        type = "LINE_LOOP";
                                        break;
                                    }
                                    case GLTFPrimitiveMode.LINE_STRIP: {
                                        type = "LINE_STRIP";
                                        break;
                                    }
                                    case GLTFPrimitiveMode.POINTS: {
                                        type = "POINTS";
                                        break;
                                    }
                                }

                                throw new Error(
                                    `Unsupported type "${type}" (${
                                        storage.meshes[storage.nodes[i].mesh]
                                            .primitives[j].mode
                                    }) in GLTF model.`
                                );
                            }
                        }

                        for (let k = 0; k < verticesAccessor.count; k++) {
                            points.push({
                                x: pointsBinary[k * 3],
                                y: pointsBinary[k * 3 + 1],
                                z: pointsBinary[k * 3 + 2],
                            });
                        }

                        let normals: Array<IVector> = [];

                        if (
                            storage.meshes[storage.nodes[i].mesh].primitives[j]
                                .attributes.NORMAL !== undefined
                        ) {
                            /*
                             ***************************************************
                             *               Access normals buffer             *
                             ***************************************************
                             */
                            const normalsAccessor =
                                storage.accessors[
                                    storage.meshes[storage.nodes[i].mesh]
                                        .primitives[j].attributes.NORMAL
                                ];
                            const normalsBufferView =
                                storage.bufferViews[normalsAccessor.bufferView];
                            const normalsBuffer =
                                storage.buffers[normalsBufferView.buffer];

                            let normalsBinary: Float32Array;

                            if (normalsBufferView.byteStride) {
                                // Get buffer
                                let buffer: ArrayBuffer;

                                if (normalsBuffer.uri) {
                                    buffer = this.accessBuffer(
                                        normalsBuffer.uri
                                    );
                                } else {
                                    buffer = this.binaries[0].data;
                                }

                                let newBuffer = new Uint8Array(
                                    normalsAccessor.count * 3 * 4
                                );
                                let oldBuffer = new Uint8Array(
                                    buffer.slice(
                                        (normalsBufferView.byteOffset || 0) +
                                            (normalsAccessor.byteOffset || 0)
                                    )
                                );

                                for (
                                    let i = 0;
                                    i < normalsAccessor.count * 3 * 4;
                                    i++
                                ) {
                                    newBuffer[i] =
                                        oldBuffer[
                                            i *
                                                (normalsBufferView.byteStride +
                                                    1)
                                        ];
                                }

                                normalsBinary = new Float32Array(
                                    newBuffer,
                                    0,
                                    normalsAccessor.count
                                );
                            } else {
                                let buffer: ArrayBuffer;

                                if (normalsBuffer.uri) {
                                    buffer = this.accessBuffer(
                                        normalsBuffer.uri
                                    );
                                } else {
                                    buffer = this.binaries[0].data;
                                }

                                normalsBinary = new Float32Array(
                                    buffer.slice(
                                        (normalsBufferView.byteOffset || 0) +
                                            (normalsAccessor.byteOffset || 0)
                                    ),
                                    0,
                                    normalsAccessor.count * 3
                                );
                            }

                            for (
                                let i = 0;
                                i < normalsAccessor.count * 3;
                                i += 3
                            ) {
                                normals.push({
                                    x: normalsBinary[i],
                                    y: normalsBinary[i + 1],
                                    z: normalsBinary[i + 2],
                                });
                            }
                        }

                        let uvs: Array<IVector2D> = [];

                        if (
                            storage.meshes[storage.nodes[i].mesh].primitives[j]
                                .attributes.TEXCOORD_0 !== undefined
                        ) {
                            /*
                             ***************************************************
                             *                 Access UVs buffer               *
                             ***************************************************
                             */

                            const uvsAccessor =
                                storage.accessors[
                                    storage.meshes[storage.nodes[i].mesh]
                                        .primitives[j].attributes.TEXCOORD_0
                                ];
                            const uvsBufferView =
                                storage.bufferViews[uvsAccessor.bufferView];
                            const uvsBuffer =
                                storage.buffers[uvsBufferView.buffer];

                            let uvsBinary: Float32Array;

                            if (uvsBufferView.byteStride) {
                                // Get buffer
                                let buffer: ArrayBuffer;
                                let componentSize: 1 | 2 | 4;
                                let arrayType:
                                    | Uint8ArrayConstructor
                                    | Int8ArrayConstructor
                                    | Uint16ArrayConstructor
                                    | Int16ArrayConstructor
                                    | Uint32ArrayConstructor
                                    | Float32ArrayConstructor;

                                if (uvsBuffer.uri) {
                                    buffer = this.accessBuffer(uvsBuffer.uri);
                                } else {
                                    buffer = this.binaries[0].data;
                                }

                                switch (uvsAccessor.componentType) {
                                    case GLTFDataType.FLOAT: {
                                        componentSize = 4;
                                        arrayType = Float32Array;
                                        break;
                                    }
                                    case GLTFDataType.SIGNED_BYTE: {
                                        console.warn(
                                            'Ultra3.GLTFLoader: Unexpected data type "SIGNED BYTE" for UVs.'
                                        );
                                        componentSize = 1;
                                        arrayType = Int8Array;
                                        break;
                                    }
                                    case GLTFDataType.UNSIGNED_BYTE: {
                                        componentSize = 1;
                                        arrayType = Uint8Array;
                                        break;
                                    }
                                    case GLTFDataType.SIGNED_SHORT: {
                                        console.warn(
                                            'Ultra3.GLTFLoader: Unexpected data type "SIGNED SHORT" for UVs.'
                                        );
                                        componentSize = 1;
                                        arrayType = Int16Array;
                                        break;
                                    }
                                    case GLTFDataType.UNSIGNED_SHORT: {
                                        componentSize = 2;
                                        arrayType = Uint16Array;
                                        break;
                                    }
                                    case GLTFDataType.UNSIGNED_INT: {
                                        console.warn(
                                            'Ultra3.GLTFLoader: Unexpected data type "UNSIGNED INT" for UVs.'
                                        );
                                        componentSize = 4;
                                        arrayType = Uint32Array;
                                        break;
                                    }
                                    default: {
                                        throw new Error(
                                            `Unknown UVs data type "${uvsAccessor.componentType}".`
                                        );
                                    }
                                }

                                let newBuffer = new Uint8Array(
                                    uvsAccessor.count * 2 * componentSize
                                );
                                let oldBuffer = new Uint8Array(
                                    buffer.slice(
                                        (uvsBufferView.byteOffset || 0) +
                                            (uvsAccessor.byteOffset || 0)
                                    )
                                );

                                for (
                                    let i = 0;
                                    i < uvsAccessor.count * 2 * componentSize;
                                    i++
                                ) {
                                    newBuffer[i] =
                                        oldBuffer[
                                            i * (uvsBufferView.byteStride + 1)
                                        ];
                                }

                                uvsBinary = convertToFloat(
                                    new arrayType(
                                        newBuffer,
                                        0,
                                        uvsAccessor.count * 2
                                    )
                                );
                            } else {
                                let buffer: ArrayBuffer;

                                if (uvsBuffer.uri) {
                                    buffer = this.accessBuffer(uvsBuffer.uri);
                                } else {
                                    buffer = this.binaries[0].data;
                                }

                                switch (uvsAccessor.componentType) {
                                    case GLTFDataType.FLOAT: {
                                        uvsBinary = new Float32Array(
                                            buffer.slice(
                                                (uvsBufferView.byteOffset ||
                                                    0) +
                                                    (uvsAccessor.byteOffset ||
                                                        0)
                                            ),
                                            0,
                                            uvsAccessor.count * 2
                                        );
                                        break;
                                    }
                                    case GLTFDataType.UNSIGNED_BYTE: {
                                        uvsBinary = convertToFloat(
                                            new Uint8Array(
                                                buffer.slice(
                                                    (uvsBufferView.byteOffset ||
                                                        0) +
                                                        (uvsAccessor.byteOffset ||
                                                            0)
                                                ),
                                                0,
                                                uvsAccessor.count * 2
                                            )
                                        );
                                        break;
                                    }
                                    case GLTFDataType.UNSIGNED_SHORT: {
                                        uvsBinary = convertToFloat(
                                            new Uint16Array(
                                                buffer.slice(
                                                    (uvsBufferView.byteOffset ||
                                                        0) +
                                                        (uvsAccessor.byteOffset ||
                                                            0)
                                                ),
                                                0,
                                                uvsAccessor.count * 2
                                            )
                                        );
                                        break;
                                    }
                                    case GLTFDataType.UNSIGNED_INT: {
                                        console.warn(
                                            'Ultra3.GLTFLoader: Unexpected data type "UNSIGNED INT" for UVs.'
                                        );
                                        uvsBinary = convertToFloat(
                                            new Uint32Array(
                                                buffer.slice(
                                                    (uvsBufferView.byteOffset ||
                                                        0) +
                                                        (uvsAccessor.byteOffset ||
                                                            0)
                                                ),
                                                0,
                                                uvsAccessor.count * 2
                                            )
                                        );
                                        break;
                                    }
                                    case GLTFDataType.SIGNED_BYTE: {
                                        console.warn(
                                            'Ultra3.GLTFLoader: Unexpected data type "SIGNED BYTE" for UVs.'
                                        );
                                        uvsBinary = convertToFloat(
                                            new Int8Array(
                                                buffer.slice(
                                                    (uvsBufferView.byteOffset ||
                                                        0) +
                                                        (uvsAccessor.byteOffset ||
                                                            0)
                                                ),
                                                0,
                                                uvsAccessor.count * 2
                                            )
                                        );
                                        break;
                                    }
                                    case GLTFDataType.SIGNED_SHORT: {
                                        console.warn(
                                            'Ultra3.GLTFLoader: Unexpected data type "SIGNED SHORT" for UVs.'
                                        );
                                        uvsBinary = convertToFloat(
                                            new Int16Array(
                                                buffer.slice(
                                                    (uvsBufferView.byteOffset ||
                                                        0) +
                                                        (uvsAccessor.byteOffset ||
                                                            0)
                                                ),
                                                0,
                                                uvsAccessor.count * 2
                                            )
                                        );
                                        break;
                                    }
                                    default:
                                        throw new Error(
                                            `Unknown UVs data type "${uvsAccessor.componentType}".`
                                        );
                                }

                                for (let k = 0; k < uvsBinary.length; k += 2) {
                                    uvs.push({
                                        x: uvsBinary[k],
                                        y: uvsBinary[k + 1],
                                    });
                                }
                            }
                        }

                        /*
                         ***************************************************
                         *                  Parse materials                *
                         ***************************************************
                         */

                        let material: IMaterial;

                        const GLTFMaterial =
                            storage.materials[
                                storage.meshes[storage.nodes[i].mesh]
                                    .primitives[j].material || 0
                            ];
                        let albedo: ITexture2D<Uint8Array>;
                        let metallic: ITexture2D<Uint8Array>;
                        let roughness: ITexture2D<Uint8Array>;
                        let normalsTexture: ITexture2D<Uint8Array>;
                        let occlusion: ITexture2D<Uint8Array>;
                        let emissive: ITexture2D<Uint8Array>;

                        if (GLTFMaterial.pbrMetallicRoughness) {
                            /*
                             *****************************************
                             *           Get albedo texture          *
                             *****************************************
                             */
                            if (
                                GLTFMaterial.pbrMetallicRoughness
                                    .baseColorTexture && this.engine !== null
                            ) {
                                const texture =
                                    storage.textures[
                                        GLTFMaterial.pbrMetallicRoughness
                                            .baseColorTexture.index
                                    ];
                                const image = storage.images[texture.source];

                                const accessedImage = this.accessImage(
                                    image.uri
                                );
                                const imageData = accessedImage.data;

                                // Apply factor to image data
                                if (
                                    GLTFMaterial.pbrMetallicRoughness
                                        .baseColorFactor
                                ) {
                                    let factor =
                                        GLTFMaterial.pbrMetallicRoughness
                                            .baseColorFactor;

                                    for (
                                        let i = 0;
                                        i < imageData.length;
                                        i += 4
                                    ) {
                                        imageData[i] *= factor[0];
                                        imageData[i + 1] *= factor[1];
                                        imageData[i + 2] *= factor[2];
                                        imageData[i + 3] *= factor[3];
                                    }
                                }

                                let magSamplingMode: SamplingMode =
                                    SamplingMode.TRILINEAR;
                                let minSamplingMode: SamplingMode =
                                    SamplingMode.TRILINEAR;

                                if (texture.sampler) {
                                    const sampler =
                                        storage.samplers[texture.sampler];

                                    switch (sampler.magFilter) {
                                        case GLTFUnMipMappedTextureFilter.NEAREST: {
                                            magSamplingMode =
                                                SamplingMode.NEAREST;
                                            break;
                                        }
                                        case GLTFUnMipMappedTextureFilter.LINEAR: {
                                            magSamplingMode =
                                                SamplingMode.TRILINEAR;
                                            break;
                                        }
                                    }

                                    switch (sampler.minFilter) {
                                        case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_LINEAR:
                                        case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_NEAREST:
                                        case GLTFMipMappedTextureFilter.NEAREST: {
                                            minSamplingMode =
                                                SamplingMode.NEAREST;
                                            break;
                                        }
                                        case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_LINEAR:
                                        case GLTFMipMappedTextureFilter.LINEAR: {
                                            minSamplingMode =
                                                SamplingMode.TRILINEAR;
                                            break;
                                        }
                                        case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_NEAREST: {
                                            minSamplingMode =
                                                SamplingMode.BILINEAR;
                                            break;
                                        }
                                    }
                                }

                                albedo = new Texture2D<IUint8TextureOptions>({
                                    width: accessedImage.width,
                                    height: accessedImage.height,
                                    frames: [imageData],
                                    framesPerSecond: 0,
                                    colorMode: ColorMode.RGBA,
                                    textureFormat:
                                        TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                    magSamplingMode: magSamplingMode,
                                    minSamplingMode: minSamplingMode,
                                    offset: GLTFMaterial.pbrMetallicRoughness
                                        .baseColorTexture.extensions
                                        ?.KHR_texture_transform?.offset || [
                                        0, 0,
                                    ],
                                    rotation: [
                                        GLTFMaterial.pbrMetallicRoughness
                                            .baseColorTexture.extensions
                                            ?.KHR_texture_transform?.rotation ||
                                            0,
                                    ],
                                    scale: GLTFMaterial.pbrMetallicRoughness
                                        .baseColorTexture.extensions
                                        ?.KHR_texture_transform?.scale || [
                                        1, 1,
                                    ],
                                }, this.engine);
                            } else if(this.engine !== null) {
                                let color: [number, number, number, number] = [
                                    1.0, 1.0, 1.0, 1.0,
                                ];

                                if (
                                    GLTFMaterial.pbrMetallicRoughness
                                        .baseColorFactor
                                ) {
                                    color =
                                        GLTFMaterial.pbrMetallicRoughness
                                            .baseColorFactor;
                                }

                                albedo = new Texture2D({
                                    width: 1,
                                    height: 1,
                                    frames: [new Uint8Array(color)],
                                    textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                    colorMode: ColorMode.RGBA,
                                    framesPerSecond: 1,
                                    magSamplingMode: SamplingMode.NEAREST,
                                    minSamplingMode: SamplingMode.NEAREST
                                }, this.engine);
                            }

                            /*
                             *****************************************
                             *    Get metallic-roughness texture     *
                             *****************************************
                             */
                            if (
                                GLTFMaterial.pbrMetallicRoughness
                                    .metallicRoughnessTexture && this.engine !== null
                            ) {
                                const texture =
                                    storage.textures[
                                        GLTFMaterial.pbrMetallicRoughness
                                            .metallicRoughnessTexture.index
                                    ];
                                const image = storage.images[texture.source];

                                const accessedImage = this.accessImage(
                                    image.uri
                                );
                                const imageData = accessedImage.data;

                                const metallicData = new Uint8Array(
                                    imageData.length * 0.25
                                );
                                const roughnessData = new Uint8Array(
                                    imageData.length * 0.25
                                );

                                // Apply factor to image data
                                if (
                                    GLTFMaterial.pbrMetallicRoughness
                                        .metallicFactor ||
                                    GLTFMaterial.pbrMetallicRoughness
                                        .roughnessFactor
                                ) {
                                    let metallicFactor =
                                        GLTFMaterial.pbrMetallicRoughness
                                            .metallicFactor || 1;
                                    let roughnessFactor =
                                        GLTFMaterial.pbrMetallicRoughness
                                            .roughnessFactor || 1;

                                    for (
                                        let i = 0;
                                        i < imageData.length * 0.25;
                                        i++
                                    ) {
                                        metallicData[i] =
                                            imageData[i * 4 + 1] *
                                            metallicFactor; // Blue * metallicFactor
                                        roughnessData[i] =
                                            imageData[i * 4 + 2] *
                                            roughnessFactor; // Green * roughnessFactor
                                    }
                                }

                                let magSamplingMode: SamplingMode =
                                    SamplingMode.TRILINEAR;
                                let minSamplingMode: SamplingMode =
                                    SamplingMode.TRILINEAR;

                                if (texture.sampler) {
                                    const sampler =
                                        storage.samplers[texture.sampler];

                                    switch (sampler.magFilter) {
                                        case GLTFUnMipMappedTextureFilter.NEAREST: {
                                            magSamplingMode =
                                                SamplingMode.NEAREST;
                                            break;
                                        }
                                        case GLTFUnMipMappedTextureFilter.LINEAR: {
                                            magSamplingMode =
                                                SamplingMode.TRILINEAR;
                                            break;
                                        }
                                    }

                                    switch (sampler.minFilter) {
                                        case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_LINEAR:
                                        case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_NEAREST:
                                        case GLTFMipMappedTextureFilter.NEAREST: {
                                            minSamplingMode =
                                                SamplingMode.NEAREST;
                                            break;
                                        }
                                        case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_LINEAR:
                                        case GLTFMipMappedTextureFilter.LINEAR: {
                                            minSamplingMode =
                                                SamplingMode.TRILINEAR;
                                            break;
                                        }
                                        case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_NEAREST: {
                                            minSamplingMode =
                                                SamplingMode.BILINEAR;
                                            break;
                                        }
                                    }
                                }

                                metallic = new Texture2D<IUint8TextureOptions>({
                                    width: accessedImage.width,
                                    height: accessedImage.height,
                                    frames: [metallicData],
                                    framesPerSecond: 0,
                                    colorMode: ColorMode.LUMINANCE,
                                    textureFormat:
                                        TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                    magSamplingMode: magSamplingMode,
                                    minSamplingMode: minSamplingMode,
                                    offset: GLTFMaterial.pbrMetallicRoughness
                                        .metallicRoughnessTexture.extensions
                                        ?.KHR_texture_transform?.offset || [
                                        0, 0,
                                    ],
                                    rotation: [
                                        GLTFMaterial.pbrMetallicRoughness
                                            .metallicRoughnessTexture.extensions
                                            ?.KHR_texture_transform?.rotation ||
                                            0,
                                    ],
                                    scale: GLTFMaterial.pbrMetallicRoughness
                                        .metallicRoughnessTexture.extensions
                                        ?.KHR_texture_transform?.scale || [
                                        1, 1,
                                    ],
                                }, this.engine);

                                roughness = new Texture2D<IUint8TextureOptions>(
                                    {
                                        width: accessedImage.width,
                                        height: accessedImage.height,
                                        frames: [roughnessData],
                                        framesPerSecond: 0,
                                        colorMode: ColorMode.LUMINANCE,
                                        textureFormat:
                                            TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                        magSamplingMode: magSamplingMode,
                                        minSamplingMode: minSamplingMode,
                                        offset: GLTFMaterial
                                            .pbrMetallicRoughness
                                            .metallicRoughnessTexture.extensions
                                            ?.KHR_texture_transform?.offset || [
                                            0, 0,
                                        ],
                                        rotation: [
                                            GLTFMaterial.pbrMetallicRoughness
                                                .metallicRoughnessTexture
                                                .extensions
                                                ?.KHR_texture_transform
                                                ?.rotation || 0,
                                        ],
                                        scale: GLTFMaterial.pbrMetallicRoughness
                                            .metallicRoughnessTexture.extensions
                                            ?.KHR_texture_transform?.scale || [
                                            1, 1,
                                        ],
                                    }, this.engine
                                );
                            } else if(this.engine !== null) {
                                let metallicFactor =
                                    1.0 ||
                                    GLTFMaterial.pbrMetallicRoughness
                                        .metallicFactor;
                                let roughnessFactor =
                                    1.0 ||
                                    GLTFMaterial.pbrMetallicRoughness
                                        .roughnessFactor;

                                metallic = new Texture2D({
                                    width: 1,
                                    height: 1,
                                    frames: [new Uint8Array([metallicFactor])],
                                    textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                    colorMode: ColorMode.LUMINANCE,
                                    framesPerSecond: 1,
                                    magSamplingMode: SamplingMode.NEAREST,
                                    minSamplingMode: SamplingMode.NEAREST
                                }, this.engine);
                                roughness = new Texture2D({
                                    width: 1,
                                    height: 1,
                                    frames: [new Uint8Array([roughnessFactor])],
                                    textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                    colorMode: ColorMode.LUMINANCE,
                                    framesPerSecond: 1,
                                    magSamplingMode: SamplingMode.NEAREST,
                                    minSamplingMode: SamplingMode.NEAREST
                                }, this.engine);
                            }
                        }

                        /*
                         *****************************************
                         *          Get normals texture          *
                         *****************************************
                         */
                        if (GLTFMaterial.normalTexture && this.engine !== null) {
                            const texture =
                                storage.textures[
                                    GLTFMaterial.normalTexture.index
                                ];
                            const image = storage.images[texture.source];

                            const accessedImage = this.accessImage(image.uri);
                            const imageData = accessedImage.data;

                            let magSamplingMode: SamplingMode =
                                SamplingMode.TRILINEAR;
                            let minSamplingMode: SamplingMode =
                                SamplingMode.TRILINEAR;

                            if (texture.sampler) {
                                const sampler =
                                    storage.samplers[texture.sampler];

                                switch (sampler.magFilter) {
                                    case GLTFUnMipMappedTextureFilter.NEAREST: {
                                        magSamplingMode = SamplingMode.NEAREST;
                                        break;
                                    }
                                    case GLTFUnMipMappedTextureFilter.LINEAR: {
                                        magSamplingMode =
                                            SamplingMode.TRILINEAR;
                                        break;
                                    }
                                }

                                switch (sampler.minFilter) {
                                    case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_LINEAR:
                                    case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_NEAREST:
                                    case GLTFMipMappedTextureFilter.NEAREST: {
                                        minSamplingMode = SamplingMode.NEAREST;
                                        break;
                                    }
                                    case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_LINEAR:
                                    case GLTFMipMappedTextureFilter.LINEAR: {
                                        minSamplingMode =
                                            SamplingMode.TRILINEAR;
                                        break;
                                    }
                                    case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_NEAREST: {
                                        minSamplingMode = SamplingMode.BILINEAR;
                                        break;
                                    }
                                }
                            }

                            normalsTexture =
                                new Texture2D<IUint8TextureOptions>({
                                    width: accessedImage.width,
                                    height: accessedImage.height,
                                    frames: [imageData],
                                    framesPerSecond: 0,
                                    colorMode: ColorMode.RGB,
                                    textureFormat:
                                        TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                    magSamplingMode: magSamplingMode,
                                    minSamplingMode: minSamplingMode,
                                    offset: GLTFMaterial.normalTexture
                                        .extensions?.KHR_texture_transform
                                        ?.offset || [0, 0],
                                    rotation: [
                                        GLTFMaterial.normalTexture.extensions
                                            ?.KHR_texture_transform?.rotation ||
                                            0,
                                    ],
                                    scale: GLTFMaterial.normalTexture.extensions
                                        ?.KHR_texture_transform?.scale || [
                                        1, 1,
                                    ],
                                }, this.engine);
                        } else if(this.engine !== null) {
                            normalsTexture = new Texture2D({
                                width: 1,
                                height: 1,
                                frames: [new Uint8Array([128, 128, 255])],
                                textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                colorMode: ColorMode.LUMINANCE,
                                framesPerSecond: 1,
                                magSamplingMode: SamplingMode.NEAREST,
                                minSamplingMode: SamplingMode.NEAREST
                            }, this.engine);
                        }

                        /*
                         *****************************************
                         *         Get occlusion texture         *
                         *****************************************
                         */
                        if (GLTFMaterial.occlusionTexture && this.engine !== null) {
                            const texture =
                                storage.textures[
                                    GLTFMaterial.occlusionTexture.index
                                ];
                            const image = storage.images[texture.source];

                            const accessedImage = this.accessImage(image.uri);
                            const imageData = accessedImage.data;

                            let magSamplingMode: SamplingMode =
                                SamplingMode.TRILINEAR;
                            let minSamplingMode: SamplingMode =
                                SamplingMode.TRILINEAR;

                            if (texture.sampler) {
                                const sampler =
                                    storage.samplers[texture.sampler];

                                switch (sampler.magFilter) {
                                    case GLTFUnMipMappedTextureFilter.NEAREST: {
                                        magSamplingMode = SamplingMode.NEAREST;
                                        break;
                                    }
                                    case GLTFUnMipMappedTextureFilter.LINEAR: {
                                        magSamplingMode =
                                            SamplingMode.TRILINEAR;
                                        break;
                                    }
                                }

                                switch (sampler.minFilter) {
                                    case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_LINEAR:
                                    case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_NEAREST:
                                    case GLTFMipMappedTextureFilter.NEAREST: {
                                        minSamplingMode = SamplingMode.NEAREST;
                                        break;
                                    }
                                    case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_LINEAR:
                                    case GLTFMipMappedTextureFilter.LINEAR: {
                                        minSamplingMode =
                                            SamplingMode.TRILINEAR;
                                        break;
                                    }
                                    case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_NEAREST: {
                                        minSamplingMode = SamplingMode.BILINEAR;
                                        break;
                                    }
                                }
                            }

                            occlusion = new Texture2D<IUint8TextureOptions>({
                                width: accessedImage.width,
                                height: accessedImage.height,
                                frames: [imageData],
                                framesPerSecond: 0,
                                colorMode: ColorMode.RGB,
                                textureFormat:
                                    TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                magSamplingMode: magSamplingMode,
                                minSamplingMode: minSamplingMode,
                                offset: GLTFMaterial.occlusionTexture.extensions
                                    ?.KHR_texture_transform?.offset || [0, 0],
                                rotation: [
                                    GLTFMaterial.occlusionTexture.extensions
                                        ?.KHR_texture_transform?.rotation || 0,
                                ],
                                scale: GLTFMaterial.occlusionTexture.extensions
                                    ?.KHR_texture_transform?.scale || [1, 1],
                            }, this.engine);
                        } else if(this.engine !== null) {
                            occlusion = new Texture2D({
                                width: 1,
                                height: 1,
                                frames: [new Uint8Array([255])],
                                textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                colorMode: ColorMode.LUMINANCE,
                                framesPerSecond: 1,
                                magSamplingMode: SamplingMode.NEAREST,
                                minSamplingMode: SamplingMode.NEAREST
                            }, this.engine);
                        }

                        /*
                         *****************************************
                         *          Get emissive texture         *
                         *****************************************
                         */
                        if (GLTFMaterial.emissiveTexture && this.engine !== null) {
                            const texture =
                                storage.textures[
                                    GLTFMaterial.emissiveTexture.index
                                ];
                            const image = storage.images[texture.source];

                            const accessedImage = this.accessImage(image.uri);
                            const imageData = accessedImage.data;

                            let magSamplingMode: SamplingMode =
                                SamplingMode.TRILINEAR;
                            let minSamplingMode: SamplingMode =
                                SamplingMode.TRILINEAR;

                            if (texture.sampler) {
                                const sampler =
                                    storage.samplers[texture.sampler];

                                switch (sampler.magFilter) {
                                    case GLTFUnMipMappedTextureFilter.NEAREST: {
                                        magSamplingMode = SamplingMode.NEAREST;
                                        break;
                                    }
                                    case GLTFUnMipMappedTextureFilter.LINEAR: {
                                        magSamplingMode =
                                            SamplingMode.TRILINEAR;
                                        break;
                                    }
                                }

                                switch (sampler.minFilter) {
                                    case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_LINEAR:
                                    case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_NEAREST:
                                    case GLTFMipMappedTextureFilter.NEAREST: {
                                        minSamplingMode = SamplingMode.NEAREST;
                                        break;
                                    }
                                    case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_LINEAR:
                                    case GLTFMipMappedTextureFilter.LINEAR: {
                                        minSamplingMode =
                                            SamplingMode.TRILINEAR;
                                        break;
                                    }
                                    case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_NEAREST: {
                                        minSamplingMode = SamplingMode.BILINEAR;
                                        break;
                                    }
                                }
                            }

                            emissive = new Texture2D<IUint8TextureOptions>({
                                width: accessedImage.width,
                                height: accessedImage.height,
                                frames: [imageData],
                                framesPerSecond: 0,
                                colorMode: ColorMode.RGB,
                                textureFormat:
                                    TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                magSamplingMode: magSamplingMode,
                                minSamplingMode: minSamplingMode,
                                offset: GLTFMaterial.emissiveTexture.extensions
                                    ?.KHR_texture_transform?.offset || [0, 0],
                                rotation: [
                                    GLTFMaterial.emissiveTexture.extensions
                                        ?.KHR_texture_transform?.rotation || 0,
                                ],
                                scale: GLTFMaterial.emissiveTexture.extensions
                                    ?.KHR_texture_transform?.scale || [1, 1],
                            }, this.engine);
                        } else if(this.engine !== null) {
                            emissive = new Texture2D({
                                width: 1,
                                height: 1,
                                frames: [new Uint8Array([255])],
                                textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                colorMode: ColorMode.LUMINANCE,
                                framesPerSecond: 1,
                                magSamplingMode: SamplingMode.NEAREST,
                                minSamplingMode: SamplingMode.NEAREST
                            }, this.engine);
                        }

                        let specularFactor = 0.0;
                        let specularTexture: ITexture2D<Uint8Array>;
                        let specularColor: ITexture2D<Uint8Array>;

                        if (GLTFMaterial.extensions) {
                            /*
                             ********************************************
                             *         Parse material extensions        *
                             ********************************************
                             */
                            if (
                                GLTFMaterial.extensions.KHR_materials_specular
                            ) {
                                /*
                                 ********************************************
                                 *         Parse specular material          *
                                 ********************************************
                                 */
                                if (
                                    GLTFMaterial.extensions
                                        .KHR_materials_specular.specularTexture && this.engine !== null
                                ) {
                                    const factor =
                                        GLTFMaterial.extensions
                                            .KHR_materials_specular
                                            .specularFactor || 1.0;
                                    const texture =
                                        storage.textures[
                                            GLTFMaterial.extensions
                                                .KHR_materials_specular
                                                .specularTexture.index
                                        ];
                                    const image =
                                        storage.images[texture.source];
                                    const accessedImage = this.accessImage(
                                        image.uri
                                    );
                                    const imageData = accessedImage.data;

                                    for (
                                        let i = 0;
                                        i < imageData.length;
                                        i += 4
                                    ) {
                                        imageData[i] *= factor;
                                        imageData[i + 1] *= factor;
                                        imageData[i + 2] *= factor;
                                    }

                                    let magSamplingMode: SamplingMode =
                                        SamplingMode.TRILINEAR;
                                    let minSamplingMode: SamplingMode =
                                        SamplingMode.TRILINEAR;

                                    if (texture.sampler) {
                                        const sampler =
                                            storage.samplers[texture.sampler];

                                        switch (sampler.magFilter) {
                                            case GLTFUnMipMappedTextureFilter.NEAREST: {
                                                magSamplingMode =
                                                    SamplingMode.NEAREST;
                                                break;
                                            }
                                            case GLTFUnMipMappedTextureFilter.LINEAR: {
                                                magSamplingMode =
                                                    SamplingMode.TRILINEAR;
                                                break;
                                            }
                                        }

                                        switch (sampler.minFilter) {
                                            case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_LINEAR:
                                            case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_NEAREST:
                                            case GLTFMipMappedTextureFilter.NEAREST: {
                                                minSamplingMode =
                                                    SamplingMode.NEAREST;
                                                break;
                                            }
                                            case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_LINEAR:
                                            case GLTFMipMappedTextureFilter.LINEAR: {
                                                minSamplingMode =
                                                    SamplingMode.TRILINEAR;
                                                break;
                                            }
                                            case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_NEAREST: {
                                                minSamplingMode =
                                                    SamplingMode.BILINEAR;
                                                break;
                                            }
                                        }
                                    }

                                    specularTexture = new Texture2D({
                                        width: accessedImage.width,
                                        height: accessedImage.height,
                                        frames: [imageData],
                                        framesPerSecond: 0,
                                        colorMode: ColorMode.RGB,
                                        textureFormat:
                                            TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                        magSamplingMode: magSamplingMode,
                                        minSamplingMode: minSamplingMode,
                                        offset: GLTFMaterial.extensions
                                            .KHR_materials_specular
                                            .specularTexture.extensions
                                            ?.KHR_texture_transform?.offset || [
                                            0, 0,
                                        ],
                                        rotation: [
                                            GLTFMaterial.extensions
                                                .KHR_materials_specular
                                                .specularTexture.extensions
                                                ?.KHR_texture_transform
                                                ?.rotation || 0,
                                        ],
                                        scale: GLTFMaterial.extensions
                                            .KHR_materials_specular
                                            .specularTexture.extensions
                                            ?.KHR_texture_transform?.scale || [
                                            1, 1,
                                        ],
                                    }, this.engine);
                                } else if(this.engine !== null) {
                                    let factor =
                                        GLTFMaterial.extensions
                                            .KHR_materials_specular
                                            .specularFactor || 1.0;
                                    specularTexture = new Texture2D({
                                        width: 1,
                                        height: 1,
                                        frames: [new Uint8Array([factor, factor, factor])],
                                        textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                        colorMode: ColorMode.LUMINANCE,
                                        framesPerSecond: 1,
                                        magSamplingMode: SamplingMode.NEAREST,
                                        minSamplingMode: SamplingMode.NEAREST
                                    }, this.engine);
                                }

                                if (
                                    GLTFMaterial.extensions
                                        .KHR_materials_specular
                                        .specularColorTexture && this.engine !== null
                                ) {
                                    const factor = GLTFMaterial.extensions
                                        .KHR_materials_specular
                                        .specularColorFactor || [1.0, 1.0, 1.0];
                                    const texture =
                                        storage.textures[
                                            GLTFMaterial.extensions
                                                .KHR_materials_specular
                                                .specularColorTexture.index
                                        ];
                                    const image =
                                        storage.images[texture.source];

                                    const accessedImage = this.accessImage(
                                        image.uri
                                    );
                                    const imageData = accessedImage.data;

                                    for (
                                        let i = 0;
                                        i < imageData.length;
                                        i += 4
                                    ) {
                                        imageData[i] *= factor[0];
                                        imageData[i + 1] *= factor[1];
                                        imageData[i + 2] *= factor[2];
                                    }

                                    let magSamplingMode: SamplingMode =
                                        SamplingMode.TRILINEAR;
                                    let minSamplingMode: SamplingMode =
                                        SamplingMode.TRILINEAR;

                                    if (texture.sampler) {
                                        const sampler =
                                            storage.samplers[texture.sampler];

                                        switch (sampler.magFilter) {
                                            case GLTFUnMipMappedTextureFilter.NEAREST: {
                                                magSamplingMode =
                                                    SamplingMode.NEAREST;
                                                break;
                                            }
                                            case GLTFUnMipMappedTextureFilter.LINEAR: {
                                                magSamplingMode =
                                                    SamplingMode.TRILINEAR;
                                                break;
                                            }
                                        }

                                        switch (sampler.minFilter) {
                                            case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_LINEAR:
                                            case GLTFMipMappedTextureFilter.NEAREST_MIPMAP_NEAREST:
                                            case GLTFMipMappedTextureFilter.NEAREST: {
                                                minSamplingMode =
                                                    SamplingMode.NEAREST;
                                                break;
                                            }
                                            case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_LINEAR:
                                            case GLTFMipMappedTextureFilter.LINEAR: {
                                                minSamplingMode =
                                                    SamplingMode.TRILINEAR;
                                                break;
                                            }
                                            case GLTFMipMappedTextureFilter.LINEAR_MIPMAP_NEAREST: {
                                                minSamplingMode =
                                                    SamplingMode.BILINEAR;
                                                break;
                                            }
                                        }
                                    }

                                    specularColor = new Texture2D({
                                        width: accessedImage.width,
                                        height: accessedImage.height,
                                        frames: [imageData],
                                        framesPerSecond: 0,
                                        colorMode: ColorMode.RGB,
                                        textureFormat:
                                            TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                        magSamplingMode: magSamplingMode,
                                        minSamplingMode: minSamplingMode,
                                        offset: GLTFMaterial.extensions
                                            .KHR_materials_specular
                                            .specularColorTexture.extensions
                                            ?.KHR_texture_transform?.offset || [
                                            0, 0,
                                        ],
                                        rotation: [
                                            GLTFMaterial.extensions
                                                .KHR_materials_specular
                                                .specularColorTexture.extensions
                                                ?.KHR_texture_transform
                                                ?.rotation || 0,
                                        ],
                                        scale: GLTFMaterial.extensions
                                            .KHR_materials_specular
                                            .specularColorTexture.extensions
                                            ?.KHR_texture_transform?.scale || [
                                            1, 1,
                                        ],
                                    }, this.engine);
                                } else if(this.engine !== null) {
                                    specularColor = new Texture2D({
                                        width: 1,
                                        height: 1,
                                        frames: [new Uint8Array(GLTFMaterial.extensions.KHR_materials_specular.specularColorFactor || [1.0, 1.0, 1.0])],
                                        textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
                                        colorMode: ColorMode.RGB,
                                        framesPerSecond: 1,
                                        magSamplingMode: SamplingMode.NEAREST,
                                        minSamplingMode: SamplingMode.NEAREST
                                    }, this.engine);
                                }
                            }
                        }

                        if(this.engine !== null) {
                            material = new PBRMaterial(this.engine, {
                                albedoTexture: albedo,
                                metallicTexture: metallic,
                                roughnessTexture: roughness,
                                normalsTexture: normalsTexture,
                                occlusionTexture: occlusion,
                                emissiveTexture: emissive,
                                specularTexture: specularTexture,
                                specularColor: specularColor,
                                specularFactor: specularFactor,
                                heightTexture: null
                            });
                        }

                        mesh = {
                            verticesMode: verticesMode,
                            vertices: points,
                            indices: indices,
                            normals: normals,
                            drawMode: DrawMode.DYNAMIC,
                            uvs: uvs,
                            pos: { x: 0, y: 0, z: 0 },
                            scale: { x: 1, y: 1, z: 1 },
                            rotation: { x: 0, y: 0, z: 0 },
                            material: material,
                        };

                        meshes.push(mesh);
                    }
                } else {
                    if (storage.nodes[i].extensions) {
                        /*
                         *****************************************
                         *           Parse extensions            *
                         *****************************************
                         */
                        if (storage.nodes[i].extensions.KHR_lights_punctual) {
                            /*
                             *****************************************
                             *         Parse light extension         *
                             *****************************************
                             */
                            const light =
                                storage.extensions.KHR_lights_punctual.lights[
                                    storage.nodes[i].extensions
                                        .KHR_lights_punctual.light
                                ];
                            let pos = storage.nodes[i].translation || [0, 0, 0];

                            lights.push(
                                new LightEntity(
                                    {
                                        classname: `light_${light.type}`,
                                        type: "point",
                                        pos: {
                                            x: pos[0],
                                            y: pos[1],
                                            z: pos[2],
                                        },
                                        itensity: light.intensity || 1,
                                        radius: 0,
                                        color: light.color || [1, 1, 1],
                                    },
                                    this.world
                                )
                            );
                        }
                    }
                }
            }
        }

        return {
            lights: lights,
            meshes: meshes,
        };
    }

    parseMeshes(res: (meshes: IScene) => any, storage: IGLTFStorage) {
        res(this.parseGLTF(storage));
    }

    loadAllExternalFiles(
        storage: IGLTFStorage,
        cb: Function,
        binariesSrc: string
    ) {
        let count = 0; // Count of loaded external files
        let externalFilesCount = 0;
        const externalBuffers: Array<IGLTFBuffer> = [];
        const externalImages: Array<GLTFImage> = [];

        for (let i = 0; i < storage.buffers.length; i++) {
            if (!storage.buffers[i].uri) {
                continue;
            }

            externalBuffers.push(storage.buffers[i]);
        }

        for (let i = 0; i < storage.images?.length || 0; i++) {
            if (!storage.images[i].uri) {
                continue;
            }

            externalImages.push(storage.images[i]);
        }

        externalFilesCount = externalBuffers.length + externalImages.length;

        if (externalFilesCount === 0) {
            cb();
            return;
        }

        // Load all external buffers
        for (let i = 0; i < externalBuffers.length; i++) {
            let url: string;

            if (storage.buffers[i].uri.startsWith("data:")) {
                url = storage.buffers[i].uri;
            } else {
                url = `${binariesSrc}/${storage.buffers[i].uri}`;
            }

            fetch(url)
                .then((data) => data.blob())
                .then((data) => data.arrayBuffer())
                .then((data) => {
                    this.loadBinaries([
                        {
                            name: storage.buffers[i].uri,
                            data: data,
                        },
                    ]);
                    count++;

                    if (count === externalFilesCount) {
                        // Call callback if we loaded all external files and there is no more files to load
                        cb();
                    }
                });
        }

        // Load all external images
        for (let i = 0; i < externalImages.length; i++) {
            let url: string;
            let mimetype: string;

            if (storage.images[i].uri.startsWith("data:")) {
                url = storage.images[i].uri;
                mimetype = storage.images[i].uri.slice(
                    5,
                    storage.images[i].uri.indexOf(";")
                );
            } else {
                url = `${binariesSrc}/${storage.images[i].uri}`;
                mimetype = `image/${storage.images[i].uri.slice(
                    storage.images[i].uri.lastIndexOf(".") + 1
                )}`;
            }

            fetch(url)
                .then((data) => data.blob())
                .then((data) => data.arrayBuffer())
                .then((data) => {
                    const uint8 = new Uint8Array(data);
                    let string = "";

                    for (let i = 0; i < uint8.length; i++) {
                        string += String.fromCharCode(uint8[i]);
                    }

                    const image = new Image();
                    image.onload = () => {
                        // Get image data
                        const canvas = document.createElement("canvas");
                        canvas.width = image.width;
                        canvas.height = image.height;

                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(image, 0, 0);

                        const imageData = ctx.getImageData(
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        ).data;

                        // Add file
                        this.loadImage(
                            storage.images[i].uri,
                            imageData as unknown as Uint8Array,
                            canvas.width,
                            canvas.height
                        );
                        count++;

                        if (count === externalFilesCount) {
                            // Call callback if we loaded all external files and there is no more files to load
                            cb();
                        }
                    };

                    image.src = `data:${mimetype};base64,${btoa(string)}`;
                });
        }
    }

    /**
     * @param storage - Storage
     * @param binary - Built-in binary ( for GLB )
     * @returns Promise, that triggers when all internal images were loaded. Promise returns new GLTFStorage with image URI's
     */
    loadAllInternalImages(
        storage: IGLTFStorage,
        binary: ArrayBuffer
    ): Promise<IGLTFStorage> {
        return new Promise((res) => {
            if (!storage.images) {
                res(storage);
                return;
            }

            const newStorage: IGLTFStorage = JSON.parse(
                JSON.stringify(storage)
            ) as IGLTFStorage; // Prevent from linking
            let count = 0;
            const internalImages: Array<GLTFImage> = [];

            // Get all internal images. Needed to find out how much there is internal images.
            for (let i = 0; i < storage.images.length; i++) {
                if (storage.images[i].bufferView) {
                    const bufferView =
                        storage.bufferViews[storage.images[i].bufferView];
                    const buffer = storage.buffers[bufferView.buffer];

                    if (!buffer.uri) {
                        internalImages.push(storage.images[i]);
                        const extension = storage.images[i].mimeType.slice(
                            6
                        ) as "png" | "jpeg";

                        newStorage.images[i].uri =
                            `${storage.images[i].name}.${extension}` ||
                            `image${internalImages.length - 1}.${extension}`;
                    }
                }
            }

            for (let i = 0; i < internalImages.length; i++) {
                const bufferView =
                    storage.bufferViews[internalImages[i].bufferView];
                let uint8 = new Uint8Array(
                    binary.slice(bufferView.byteOffset || 0)
                );
                let base64 = `data:${internalImages[i].mimeType};base64,${btoa(
                    String.fromCharCode(...uint8)
                )}`;
                const image = new Image();

                image.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);

                    const imageData = ctx.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    ).data;
                    const extension = internalImages[i].mimeType.slice(6);

                    this.loadImage(
                        `${internalImages[i].name}.${extension}` ||
                            `image${i}.${extension}`,
                        imageData as unknown as Uint8Array,
                        canvas.width,
                        canvas.height
                    );

                    count++;

                    if (count === internalImages.length) {
                        res(newStorage);
                    }
                };

                image.src = base64;
            }
        });
    }

    loadMeshes(buffer: ArrayBuffer, binariesSrc: string = ""): Promise<IScene> {
        // Unload all binaries and images
        this.binaries = [];
        this.images = {};

        return new Promise((res) => {
            let view = new DataView(buffer);

            let magic = view.getUint32(0);

            if (magic === 0x676c5446) {
                // GLB format

                const storage = this.loadGLB(buffer);

                this.loadAllExternalFiles(
                    storage,
                    () => {
                        this.loadAllInternalImages(
                            storage,
                            this.binaries[this.binaries.length - 1].data
                        ) // If GLB file contains internal buffer, this buffer would be placed in the end of buffers array
                            .then((newStorage) => {
                                this.parseMeshes(res, newStorage);
                            });
                    },
                    binariesSrc
                );
            } else if (view.getUint8(0) === 0x7b) {
                // view.getUint8(0) === '{'
                // GLTF format
                let jsonstring = "{";

                for (let i = 1; i < view.byteLength; i++) {
                    jsonstring += String.fromCharCode(view.getUint8(i));
                }

                const storage: IGLTFStorage = JSON.parse(
                    jsonstring
                ) as IGLTFStorage;

                this.loadAllExternalFiles(
                    storage,
                    () => this.parseMeshes(res, storage),
                    binariesSrc
                );
            } else {
                throw new Error(
                    `Ultra3.GLTFLoader: Cannot recognize GLTF type ("${magic}").`
                );
            }
        });
    }
}

export default GLTFLoader;
