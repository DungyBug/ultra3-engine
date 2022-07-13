export interface ITypedWebGL1RenderingContext extends WebGLRenderingContext {
    type: "WebGLRenderingContext";
}

export interface ITypedWebGL2RenderingContext extends WebGL2RenderingContext {
    type: "WebGL2RenderingContext";
}

type TypedWebGLRenderingContext = ITypedWebGL1RenderingContext | ITypedWebGL2RenderingContext;

export default TypedWebGLRenderingContext;