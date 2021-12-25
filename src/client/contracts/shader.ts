import { IKey } from "../../core/contracts/base/key";

export interface IShader {
    params: Array<IKey>;
    name: string;
};