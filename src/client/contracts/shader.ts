import { IKeyType } from "../../core/contracts/base/key";

export interface IShader {
    params: Array<IKeyType>; 
    name: string;
    type: "vertex" | "fragment";
    entryPoint?: string; // function name, name of shader by default
    source: string;
};