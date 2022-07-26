import Mesh from "../../mesh/mesh";

export default interface IRegisteredMesh {
    mesh: Mesh;
    verticesBuffer: WebGLBuffer;
    normalsBuffer: WebGLBuffer;
    uvsBuffer: WebGLBuffer;
}