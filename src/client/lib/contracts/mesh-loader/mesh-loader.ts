import IMesh from "../../../contracts/mesh";

interface IMeshLoader {
    loadMeshes(buffer: ArrayBuffer): Promise<Array<IMesh>>;
}

export default IMeshLoader;