import ILight from "./entities/light";
import IMesh from "./mesh";

interface IScene {
    lights: Array<ILight>;
    meshes: Array<IMesh>;
}

export default IScene;