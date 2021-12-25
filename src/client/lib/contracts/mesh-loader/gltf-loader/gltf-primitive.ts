import GLTFPrimitiveMode from "../../../constants/mesh-loader/gltf-loader/primitive-mode";
import IGLTFAttributes from "./gltf-attributes";
import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFPrimitive extends IGLTFExtensionable {
    [k: string]: any;
    attributes: IGLTFAttributes;
    targets?: Array<IGLTFAttributes>;
    indices?: number;
    material?: number;
    mode?: GLTFPrimitiveMode; // 4 ( TRIANGLES ) default
}

export default IGLTFPrimitive;