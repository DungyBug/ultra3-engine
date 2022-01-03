interface IGLTFTextureTransformExtension {
    offset?: [number, number]; // Default [0, 0]
    rotation?: number; // In radians. Default 0
    scale?: [number, number] // Default [1, 1]
    texCoord?: number;
}

export default IGLTFTextureTransformExtension;