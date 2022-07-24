type IOpenGLRenderTextureCubemapObject = {
    texture: WebGLTexture;
    framebufferPositiveX: WebGLFramebuffer;
    framebufferNegativeX: WebGLFramebuffer;
    framebufferPositiveY: WebGLFramebuffer;
    framebufferNegativeY: WebGLFramebuffer;
    framebufferPositiveZ: WebGLFramebuffer;
    framebufferNegativeZ: WebGLFramebuffer;
    size: number;
    id: number;
}

export default IOpenGLRenderTextureCubemapObject;