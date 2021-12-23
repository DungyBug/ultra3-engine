import { IKey } from "../../contracts/base/key";

export interface IShader {
    params: Array<IKey>;
    name: string;
};