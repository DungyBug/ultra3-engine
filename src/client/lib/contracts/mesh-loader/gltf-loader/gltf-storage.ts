import GLTFAccessor from "./gltf-accessor";
import IGLTFAnimation from "./gltf-animation";
import IGLTFAsset from "./gltf-asset";
import IGLTFBuffer from "./gltf-buffer";
import IGLTFBufferView from "./gltf-bufferView";
import GLTFCamera from "./gltf-camera";
import IGLTFExtensionable from "./gltf-extensionable";
import GLTFImage from "./gltf-image";
import GLTFMaterial from "./gltf-material";
import IGLTFMesh from "./gltf-mesh";
import IGLTFNode from "./gltf-node";
import IGLTFExtesionPunctualLight from "./extensions/gltf-punctual-light";
import IGLTFSampler from "./gltf-sampler";
import IGLTFScene from "./gltf-scene";
import IGLTFSkin from "./gltf-skin";
import IGLTFTexture from "./gltf-texture";

interface IGLTFStorage {
    [k: string]: any;
    asset: IGLTFAsset;
    scenes?: Array<IGLTFScene>;
    scene?: number;
    nodes?: Array<IGLTFNode>;
    buffers?: Array<IGLTFBuffer>;
    bufferViews?: Array<IGLTFBufferView>;
    accessors?: Array<GLTFAccessor>;
    meshes?: Array<IGLTFMesh>;
    skins?: Array<IGLTFSkin>;
    textures?: Array<IGLTFTexture>;
    images?: Array<GLTFImage>;
    samplers?: Array<IGLTFSampler>;
    materials?: Array<GLTFMaterial>;
    extensionsUsed?: Array<string>;
    extensionsRequired?: Array<string>;
    cameras?: Array<GLTFCamera>;
    animations?: Array<IGLTFAnimation>;

    // Extensions with different type from standard IGLTFExtensionable
    extensions?: {
        [k: `KHR_${string}`]: Record<string, any>,
        KHR_lights_punctual?: IGLTFExtesionPunctualLight
    };
    extras?: any; // string | number | boolean | Array<string | number | boolean> | Record<string, any>
}

export default IGLTFStorage;