import IMesh from "../../../contracts/mesh";

interface IMeshLoader {
    loadMeshes(buffer: ArrayBuffer): Array<IMesh>;
}

export default IMeshLoader;