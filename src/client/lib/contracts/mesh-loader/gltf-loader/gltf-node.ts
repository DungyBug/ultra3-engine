import { IGLTFNodeExtesionPunctualLight } from "./extensions/gltf-punctual-light";
import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFNode extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    children?: Array<number>;
    camera?: number;
    rotation?: [number, number, number, number];
    scale?: [number, number, number];
    translation?: [number, number, number];
    matrix?: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
    skin?: number;
    mesh?: number;
    weights?: Array<number>;

    extensions?: {
        KHR_lights_punctual?: IGLTFNodeExtesionPunctualLight,
    }
}

export default IGLTFNode;