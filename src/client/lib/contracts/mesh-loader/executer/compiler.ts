import IExecuterInstance from "./instance";

interface ICompiler {
    compile(instance: IExecuterInstance): IExecuterInstance;
}

export default ICompiler;