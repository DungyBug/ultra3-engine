import IMaterial from "../contracts/material";
import { IShader } from "../contracts/shader";

class NoMaterial implements IMaterial {
    getShader(): IShader {
        return {
            params: [],
            name: "blackshader"
        }
    }
}

export default NoMaterial;