enum GLTFUnMipMappedTextureFilter {
    NEAREST=9728,
    LINEAR=9729
}

enum GLTFMipMappedTextureFilter {
    NEAREST=9728,
    LINEAR=9729,
    NEAREST_MIPMAP_NEAREST=9984,
    LINEAR_MIPMAP_NEAREST=9985,
    NEAREST_MIPMAP_LINEAR=9986,
    LINEAR_MIPMAP_LINEAR=9987
}

export default GLTFMipMappedTextureFilter;
export { GLTFUnMipMappedTextureFilter };