type IOpenGLRenderTextureObject = {
    texture: WebGLTexture;
    framebuffer: WebGLFramebuffer;
    width: number;
    height: number;
    id: number;
}

export default IOpenGLRenderTextureObject;