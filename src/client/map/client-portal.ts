import IPhysicalMesh from "../../core/contracts/physical-mesh";
import Matrix3 from "../../core/lib/matrix3";
import Vector from "../../core/lib/vector";
import Portal from "../../core/map/objects/portal";
import BaseCamera from "../cameras/base-camera";
import ClientWorld from "../client-world";
import IClientPortalProps from "../contracts/map/client-portal-props";
import ClientMapObject from "./client-object";

export default class ClientPortal extends ClientMapObject<Portal> {
    protected camera: BaseCamera;

    constructor(physicalShape: IPhysicalMesh, props: IClientPortalProps, world: ClientWorld) {
        super(new Portal(physicalShape, props, world), props.mesh, world);

        this.camera = props.camera;
        this.mesh.rotation = props.rotation; // assign mesh rotation by link to rotate it according to mapobject rotation
    }

    /**
     * Tranforms portal's camera ( rotates, translates, etc. ) according to provided camera position and rotation
     * @param camera - camera from which to correct portal's camera rotation and position
     */
    transformCameraAccordingTo(camera: BaseCamera) {
        const objectProps = this.object.getProps();
        const connectionProps = this.object.connection.getProps();

        this.camera.position.set(connectionProps.pos);
        this.camera.position.mul(new Vector(-1)); // correct camera position ( yep, camera position stores as negative of its real position )

        // get camera position relatively to portal position
        const relativeCameraPos = Vector.add(camera.getPosition(), objectProps.pos);

        // get angles
        const angle = Vector.add(objectProps.rotation, connectionProps.rotation);

        // create rotation matrix
        const matrix = Matrix3.multiply(Matrix3.rotationY(angle.y), Matrix3.rotationX(angle.x));

        // rotate position
        relativeCameraPos.set(matrix.multiplyVector(relativeCameraPos));

        // rotate camera
        this.camera.rotation.set(Vector.add(camera.rotation, angle));

        // set camrea position
        this.camera.position.add(relativeCameraPos);
    }
}