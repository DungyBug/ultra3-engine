import IMaterial from "../contracts/material";
import { IShader } from "../contracts/shader";

class NoMaterial implements IMaterial {
    getShader(): IShader {
        return {
            params: [],
            name: "blackshader",
            type: "fragment"
        }
    }
}

export default NoMaterial;