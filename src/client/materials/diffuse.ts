import TypedArray from "../contracts/common/typed-array";
import IMaterial from "../contracts/material";
import TexturedMaterial from "./textured";

class DiffuseMaterial<T extends TypedArray = TypedArray> extends TexturedMaterial<T> implements IMaterial {
    getShader() {
        let parentResult = super.getShader();
        
        return {
            ...parentResult,
            name: "u3diffuse"
        };
    }
}

export default DiffuseMaterial;