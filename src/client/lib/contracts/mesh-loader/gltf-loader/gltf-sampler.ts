import GLTFMipMappedTextureFilter, { GLTFUnMipMappedTextureFilter } from "../../../constants/mesh-loader/gltf-loader/texture-filter";
import GLTFWrapMode from "../../../constants/mesh-loader/gltf-loader/wrap-mode";
import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFSampler extends IGLTFExtensionable {
    [k: string]: any;
    magFilter?: GLTFUnMipMappedTextureFilter;
    minFilter?: GLTFMipMappedTextureFilter;
    wrapS?: GLTFWrapMode; // 10497 ( REPEAT ) default
    wrapT?: GLTFWrapMode; // 10497 ( REPEAT ) default
    name?: string;
    extensions?: Array<Record<string, any>>;
    extras?: Array<any>;
}

export default IGLTFSampler;