import Matrix3 from "../../core/lib/matrix3";
import Vector from "../../core/lib/vector";
import IThirdPersonViewCamera from "../contracts/cameras/third-person-camera";
import PerspectiveCamera from "./perspective-camera";

class ThirdPersonViewCamera extends PerspectiveCamera implements IThirdPersonViewCamera {
    public distance: number;

    constructor(props: Partial<IThirdPersonViewCamera> = {}) {
        super(props);

        this.distance = props.distance || 2;
    }

    getPosition(): Vector {
        // Create shift vector
        const shift = new Vector(0, 0, this.distance);

        // Create camera rotation matrix
        const rotationMatrix = Matrix3.multiply(Matrix3.rotationY(this.rotation.y), Matrix3.rotationX(this.rotation.x));

        // Rotate shift vector by camera rotation matrix so it becomes parallel to camera direction vector
        shift.set(rotationMatrix.multiplyVector(shift));

        // Subtract shift ( camera direction ) vector from camera's origin
        return Vector.sub(this.position, shift);
    }
}

export default ThirdPersonViewCamera;