import { IKey } from "./base/key";

export interface IShader {
    vertexShader: string;
    fragmentShader: string;
    params: Array<IKey>;
    name: string;
};