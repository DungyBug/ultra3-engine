import { IKey } from "../../../core/contracts/base/key";

export interface IRendererShader {
    name: string;
    source: string;
    entryPoint?: string;
}

export interface IComplexRendererShader extends IRendererShader {
    params: Array<IKey>;
    entries: Array<string>;
}

export interface IMixShader {
    source: string;
    name: string;
    entryPoint: string;
}