import IGLTFExtensionable from "./gltf-extensionable";

interface IGLTFBaseCamera extends IGLTFExtensionable {
    [k: string]: any;
    name?: string;
    type: "perspective" | "orthographic";
}

interface IGLTFPerspectiveCameraProps extends IGLTFExtensionable {
    [k: string]: any;
    aspectRatio?: number;
    yfov: number;
    zfar?: number;
    znear: number;
}

interface IGLTFOrthographicCameraProps extends IGLTFExtensionable {
    [k: string]: any;
    xmag: number;
    ymag: number;
    zfar: number;
    znear: number;
}

interface IGLTFPerspectiveCamera extends IGLTFBaseCamera {
    type: "perspective";
    perspective: IGLTFPerspectiveCameraProps;
}

interface IGLTFOrthographicCamera extends IGLTFBaseCamera {
    type: "orthographic";
    orthographic: IGLTFOrthographicCameraProps;
}

type GLTFCamera = IGLTFPerspectiveCamera | IGLTFOrthographicCamera;

export default GLTFCamera;