import IScene from "../../../contracts/scene";

interface IMeshLoader {
    loadMeshes(buffer: ArrayBuffer): Promise<IScene>;
}

export default IMeshLoader;