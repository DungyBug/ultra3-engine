import { IShader } from "./shader";

interface IMaterial {
    getShader(): IShader;
}

export default IMaterial;