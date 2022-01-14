import { IKey } from "../../core/contracts/base/key";

export interface IShader {
    params: Array<IKey>;
    name: string;
    type: "vertex" | "fragment";
    entryPoint?: string; // function name, name of shader by default
};