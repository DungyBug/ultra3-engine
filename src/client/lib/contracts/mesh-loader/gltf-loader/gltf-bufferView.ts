import GLTFBufferViewTarget from "../../../constants/mesh-loader/gltf-loader/buffer-view-target";
import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFBufferView extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    buffer: number;
    byteLength: number;
    byteOffset?: number;
    target?: GLTFBufferViewTarget;
    byteStride?: number;
}

export default IGLTFBufferView;