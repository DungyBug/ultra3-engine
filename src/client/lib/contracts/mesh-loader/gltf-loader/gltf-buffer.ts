import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFBuffer extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    byteLength: number;
    uri?: `${string}.bin` | `${string}.glbin` | `${string}.glbuf` | `data:application/octet-stream;base64,${string}` | `data:application/gltf-buffer;base64,${string}`;
}

export default IGLTFBuffer;