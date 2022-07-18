import { IVector } from "../../../core/contracts/base/vector";
import { BaseModuleEvents } from "../../../core/contracts/module";
import BaseModuleContext from "../../../core/contracts/module-context";
import BaseCamera from "../../camera";
import ColorMode from "../../constants/color-mode";
import SamplingMode from "../../constants/sampling-mode";
import IMesh from "../../contracts/mesh";
import ClientGraphicsModuleEvents from "../../contracts/modules/client-graphics-module-events";
import BaseGraphicsModule, { BaseGraphicsModuleEvents } from "../../contracts/modules/graphics-module";
import IGraphicsParameters from "../../contracts/modules/graphics-parameters";
import ICompiledShaders from "../../contracts/renderers/opengl-renderer/compiled-shader";
import { IShader } from "../../contracts/shader";
import TextureOptions, { TextureOptsToArrayType } from "../../contracts/texture/texture-opts";
import Texture3DOptions from "../../contracts/texture/texture3d-opts";
import ViewableEntity from "../../entities/base/viewable";
import ClientMapObject from "../../map/client-object";
import Texture2D from "../../texture/texture2d";
import Texture3D from "../../texture/texture3d";
import IOpenGLRendererOptions from "./contracts/opengl-renderer-opts";
import TypedWebGLRenderingContext from "./contracts/typed-webgl-context";
import { mat4 } from "./gl-matrix/index";

export default class OpenGLRenderer extends BaseGraphicsModule<ClientGraphicsModuleEvents> {
    private width: number;
    private height: number;
    private canvas: HTMLCanvasElement;
    private gl: TypedWebGLRenderingContext;
    private shaders: Record<string, ICompiledShaders>;
    private clientMapObjects: Array<ClientMapObject>;
    private vertexBuffer: WebGLBuffer;
    private normalsBuffer: WebGLBuffer;
    private uvBuffer: WebGLBuffer;
    private camera: BaseCamera;
    private textures: Array<{
        texture: Texture2D | Texture3D;
        buffer: WebGLTexture;
    }>;

    constructor(opts: IOpenGLRendererOptions = {}) {
        super();
        this.width = opts.width || window.screen.width;
        this.height = opts.height || window.screen.height;
        this.canvas = opts.canvas || document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.textures = [];
        this.shaders = {};
        this.camera = opts.camera || new BaseCamera();
        this.clientMapObjects = [];
    }

    setActiveCamera(camera: BaseCamera): void {
        this.camera = camera;
    }

    registerShader(name: string, vertex: IShader, fragment: IShader): void {
        if(this.shaders.hasOwnProperty(name)) {
            return;
        }
        const material = this.compileShader(vertex.source, fragment.source);

        this.shaders[name] = {
            fragment: {
                shader: material.fragmentShader,
                uniforms: fragment.params
            },
            vertex: {
                shader: material.vertexShader,
                uniforms: vertex.params
            },
            program: material.program
        }
    }

    compileShader(vertexSource: string, fragmentSource: string) {
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(vertexShader, vertexSource);
        this.gl.shaderSource(fragmentShader, fragmentSource);
        this.gl.compileShader(vertexShader);
        this.gl.compileShader(fragmentShader);

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);

        this.gl.linkProgram(program);

        if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw new Error("Could not compile program:\n" + this.gl.getProgramInfoLog(program) + '\n' + this.gl.getShaderInfoLog(vertexShader) + this.gl.getShaderInfoLog(fragmentShader));
        }

        return {
            vertexShader,
            fragmentShader,
            program: program
        }
    }

    createTexture2D<T extends TextureOptions = TextureOptions>(texture: Texture2D<T>): number {
        const buffer = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, buffer);
        let mode: GLenum = this.gl.LUMINANCE;

        switch(texture.colorMode) {
            case ColorMode.R: {
                if(this.gl.type === "WebGL2RenderingContext") {
                    mode = this.gl.RED;
                }
                break;
            }
            case ColorMode.RG: {
                if(this.gl.type === "WebGL2RenderingContext") {
                    mode = this.gl.RG;
                }
                break;
            }
            case ColorMode.RGB: {
                mode = this.gl.RGB;
                break;
            }
            case ColorMode.RGBA: {
                mode = this.gl.RGBA;
                break;
            }
            case ColorMode.LUMINANCE: {
                mode = this.gl.LUMINANCE;
                break;
            }
            case ColorMode.LUMINANCE_ALPHA: {
                mode = this.gl.LUMINANCE_ALPHA;
                break;
            }
            case ColorMode.ALPHA: {
                mode = this.gl.ALPHA;
                break;
            }
        }

        const data = texture.getFrame(0);

        let type: GLenum = this.texFormatToGLenum(data);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        let minSamplingMode: GLenum;
        let magSamplingMode: GLenum;

        switch(texture.minSamplingMode) {
            case SamplingMode.NEAREST: {
                minSamplingMode = this.gl.NEAREST_MIPMAP_NEAREST;
                break;
            }
            case SamplingMode.BILINEAR: {
                minSamplingMode = this.gl.LINEAR_MIPMAP_NEAREST;
                break;
            }
            case SamplingMode.BICUBIC: // TODO: Add bicubic implementation support
            case SamplingMode.TRILINEAR: {
                minSamplingMode = this.gl.LINEAR_MIPMAP_LINEAR;
                break;
            }
        }

        switch(texture.magSamplingMode) {
            case SamplingMode.NEAREST: {
                magSamplingMode = this.gl.NEAREST;
                break;
            }
            case SamplingMode.BICUBIC:
            case SamplingMode.TRILINEAR:
            case SamplingMode.BILINEAR: {
                magSamplingMode = this.gl.LINEAR;
                break;
            }
        }
    
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, minSamplingMode);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, magSamplingMode);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        this.textures.push({
            texture,
            buffer
        });

        return this.textures.length - 1;
    }

    updateTexture2D(textureId: number, time: number, timedelta: number) {
        const {texture, buffer} = this.textures[textureId];

        // Check if current frame is changed
        if(Math.floor(time * texture.framesPerSecond) - Math.floor((time - timedelta) * texture.framesPerSecond) === 0) {
            return; // It hasn't changed yet
        }

        let mode: GLenum = this.gl.LUMINANCE;

        switch(texture.colorMode) {
            case ColorMode.R: {
                if(this.gl.type === "WebGL2RenderingContext") {
                    mode = this.gl.RED;
                }
                break;
            }
            case ColorMode.RG: {
                if(this.gl.type === "WebGL2RenderingContext") {
                    mode = this.gl.RG;
                }
                break;
            }
            case ColorMode.RGB: {
                mode = this.gl.RGB;
                break;
            }
            case ColorMode.RGBA: {
                mode = this.gl.RGBA;
                break;
            }
            case ColorMode.LUMINANCE: {
                mode = this.gl.LUMINANCE;
                break;
            }
            case ColorMode.LUMINANCE_ALPHA: {
                mode = this.gl.LUMINANCE_ALPHA;
                break;
            }
            case ColorMode.ALPHA: {
                mode = this.gl.ALPHA;
                break;
            }
        }
        const data = texture.getRawData(time);

        // if(data.length === 0) {
        //     return;
        // }
        
        let type: GLenum = this.texFormatToGLenum(data);

        this.gl.bindTexture(this.gl.TEXTURE_2D, buffer);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    createTexture3D<T extends Texture3DOptions = Texture3DOptions>(texture: Texture3D<T>): number {
        if(this.gl.type === "WebGL2RenderingContext") {
            const buffer = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_3D, buffer);
            let mode: GLenum = this.gl.LUMINANCE;
    
            switch(texture.colorMode) {
                case ColorMode.R: {
                    mode = this.gl.RED;
                    break;
                }
                case ColorMode.RG: {
                    mode = this.gl.RG;
                    break;
                }
                case ColorMode.RGB: {
                    mode = this.gl.RGB;
                    break;
                }
                case ColorMode.RGBA: {
                    mode = this.gl.RGBA;
                    break;
                }
                case ColorMode.LUMINANCE: {
                    mode = this.gl.LUMINANCE;
                    break;
                }
                case ColorMode.LUMINANCE_ALPHA: {
                    mode = this.gl.LUMINANCE_ALPHA;
                    break;
                }
                case ColorMode.ALPHA: {
                    mode = this.gl.ALPHA;
                    break;
                }
            }
    
            const data = texture.getFrame(0);
    
            let type: GLenum = this.texFormatToGLenum(data);
    
            this.gl.texImage3D(this.gl.TEXTURE_3D, 0, mode, texture.dimensions[0], texture.dimensions[1], texture.dimensions[2], 0, mode, type, data);
            this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    
            let minSamplingMode: GLenum;
            let magSamplingMode: GLenum;
    
            switch(texture.minSamplingMode) {
                case SamplingMode.NEAREST: {
                    minSamplingMode = this.gl.NEAREST_MIPMAP_NEAREST;
                    break;
                }
                case SamplingMode.BILINEAR: {
                    minSamplingMode = this.gl.LINEAR_MIPMAP_NEAREST;
                    break;
                }
                case SamplingMode.BICUBIC: // TODO: Add bicubic implementation support
                case SamplingMode.TRILINEAR: {
                    minSamplingMode = this.gl.LINEAR_MIPMAP_LINEAR;
                    break;
                }
            }
    
            switch(texture.magSamplingMode) {
                case SamplingMode.NEAREST: {
                    magSamplingMode = this.gl.NEAREST;
                    break;
                }
                case SamplingMode.BICUBIC:
                case SamplingMode.TRILINEAR:
                case SamplingMode.BILINEAR: {
                    magSamplingMode = this.gl.LINEAR;
                    break;
                }
            }
        
            this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MIN_FILTER, minSamplingMode);
            this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MAG_FILTER, magSamplingMode);
    
            this.textures.push({
                texture,
                buffer
            });
    
            return this.textures.length - 1;
        } else {
            console.warn("OpenGLRenderer: attempt to create unsupported texture3D.");
            return -1;
        }
    }

    updateTexture3D(textureId: number, time: number, timedelta: number) {
        if(this.gl.type === "WebGL2RenderingContext") {
            const {texture, buffer} = this.textures[textureId];

            // Check if current frame is changed
            if(Math.floor(time * texture.framesPerSecond) - Math.floor((time - timedelta) * texture.framesPerSecond) === 0) {
                return; // It hasn't changed yet
            }

            let mode: GLenum = this.gl.LUMINANCE;

            switch(texture.colorMode) {
                case ColorMode.R: {
                    mode = this.gl.RED;
                    break;
                }
                case ColorMode.RG: {
                    mode = this.gl.RG;
                    break;
                }
                case ColorMode.RGB: {
                    mode = this.gl.RGB;
                    break;
                }
                case ColorMode.RGBA: {
                    mode = this.gl.RGBA;
                    break;
                }
                case ColorMode.LUMINANCE: {
                    mode = this.gl.LUMINANCE;
                    break;
                }
                case ColorMode.LUMINANCE_ALPHA: {
                    mode = this.gl.LUMINANCE_ALPHA;
                    break;
                }
                case ColorMode.ALPHA: {
                    mode = this.gl.ALPHA;
                    break;
                }
            }
            const data = texture.getRawData(time);
            // if(data.length === 0) {
            //     return;
            // }
            
            let type: GLenum = this.texFormatToGLenum(data);

            this.gl.bindTexture(this.gl.TEXTURE_3D, buffer);
            this.gl.texImage3D(this.gl.TEXTURE_3D, 0, mode, texture.dimensions[0], texture.dimensions[1], texture.dimensions[2], 0, mode, type, data);
        }
    }

    freeTexture(textureId: number): void {
        this.textures.splice(textureId, 1);
    }

    init(parameters: IGraphicsParameters & { context: BaseModuleContext<BaseGraphicsModuleEvents & BaseModuleEvents>; }): void {
        super.init(parameters);
        this.width = parameters.width;
        this.height = parameters.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Try to init WebGL
        const webgl2Context = this.canvas.getContext("webgl2", {antialias : false});

        if(webgl2Context === null) {
            const webgl1Context = this.canvas.getContext("webgl", {antialias : false});

            if(webgl1Context === null) {
                throw new Error("OpenGLRenderer: Unable to initialize WebGL. Your browser or machine may not support it.");
            } else {
                this.gl = Object.assign<WebGLRenderingContext, {type: "WebGLRenderingContext"}>(webgl1Context, {
                    type: "WebGLRenderingContext"
                });
            }
        } else {
            this.gl = Object.assign<WebGL2RenderingContext, {type: "WebGL2RenderingContext"}>(webgl2Context, {
                type: "WebGL2RenderingContext"
            });
        }

        if(this.gl.type === "WebGL2RenderingContext") {
            console.log("OpenGLRenderer: WebGL2 initialized.");
        } else {
            console.log("OpenGLRenderer: WebGL initialized.");
        }
        
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearDepth(1.0);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

        document.body.append(this.canvas);

        this.vertexBuffer = this.gl.createBuffer();
        this.normalsBuffer = this.gl.createBuffer();
        this.uvBuffer = this.gl.createBuffer();

        this.context.emitter.on("frameend", this.render.bind(this));
        this.context.emitter.on("clientmapobject", this.handleClientMapObject.bind(this));
    }

    handleClientMapObject(object: ClientMapObject) {
        this.clientMapObjects.push(object);
    }

    setParams(parameters: Partial<IGraphicsParameters>) {
        this.width = parameters.width || this.width;
        this.height = parameters.height || this.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.gl.viewport(0, 0, this.width, this.height);
    }

    render() {
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, this.camera.fov, this.width / this.height, 0.1, 100.0);

        const cameraViewMatrix = mat4.create();
        mat4.rotateX(cameraViewMatrix, cameraViewMatrix, this.camera.rotation.x);
        mat4.rotateY(cameraViewMatrix, cameraViewMatrix, this.camera.rotation.y);
        mat4.rotateZ(cameraViewMatrix, cameraViewMatrix, this.camera.rotation.z);
        mat4.translate(cameraViewMatrix, cameraViewMatrix, [
            this.camera.position.x, this.camera.position.y, this.camera.position.z
        ]);

        const meshes: Array<IMesh> = [];

        for(const entity of this.context.world.entities) {
            if(entity instanceof ViewableEntity) {
                meshes.push(entity.model);
            }
        }

        for(const object of this.clientMapObjects) {
            meshes.push(object.mesh);
        }

        for(const mesh of meshes) {
            let textureCount = 0;

            const shader = this.shaders[mesh.material.name];
            this.gl.useProgram(shader.program);

            // Setup all attributes and uniforms
            // Built-in attributes
            const positionAttributeLocation = this.gl.getAttribLocation(shader.program, "position");
            const projectionMatrixUniformLocation = this.gl.getUniformLocation(shader.program, "projectionMatrix");
            const worldViewMatrixUniformLocation = this.gl.getUniformLocation(shader.program, "worldViewMatrix");
            const modelViewMatrixUniformLocation = this.gl.getUniformLocation(shader.program, "modelViewMatrix");
            const u3NormalAttributeLocation = this.gl.getAttribLocation(shader.program, "u3Normal");
            const u3UvAttributeLocation = this.gl.getAttribLocation(shader.program, "u3Uv");

            this.gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);

            // Now generate matrix for model world view and model view matrix
            const modelWorldViewMatrix = mat4.create();
            mat4.translate(modelWorldViewMatrix, cameraViewMatrix, [
                mesh.pos.x, mesh.pos.y, mesh.pos.z
            ]);

            mat4.rotateX(modelWorldViewMatrix, modelWorldViewMatrix, mesh.rotation.x);
            mat4.rotateY(modelWorldViewMatrix, modelWorldViewMatrix, mesh.rotation.y);
            mat4.rotateZ(modelWorldViewMatrix, modelWorldViewMatrix, mesh.rotation.z);

            mat4.scale(modelWorldViewMatrix, modelWorldViewMatrix, [
                mesh.scale.x, mesh.scale.y, mesh.scale.z
            ]);

            this.gl.uniformMatrix4fv(worldViewMatrixUniformLocation, false, modelWorldViewMatrix);

            const modelViewMatrix = mat4.create();
            mat4.translate(modelViewMatrix, modelViewMatrix, [
                mesh.pos.x, mesh.pos.y, mesh.pos.z
            ]);

            mat4.rotateX(modelViewMatrix, modelViewMatrix, mesh.rotation.x);
            mat4.rotateY(modelViewMatrix, modelViewMatrix, mesh.rotation.y);
            mat4.rotateZ(modelViewMatrix, modelViewMatrix, mesh.rotation.z);

            mat4.scale(modelViewMatrix, modelViewMatrix, [
                mesh.scale.x, mesh.scale.y, mesh.scale.z
            ]);

            this.gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

            if(u3NormalAttributeLocation > -1) {
                // Generate normals array
                const normalsArray = new Float32Array(mesh.indices.length * 3);
                for(let i = 0; i < mesh.indices.length; i++) {
                    let normal = mesh.normals[mesh.indices[i]];

                    normalsArray[i * 3] = normal.x;
                    normalsArray[i * 3 + 1] = normal.y;
                    normalsArray[i * 3 + 2] = normal.z;
                }

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalsBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, normalsArray, this.gl.DYNAMIC_DRAW);
                this.gl.vertexAttribPointer(u3NormalAttributeLocation, 3, this.gl.FLOAT, true, 0, 0);
                this.gl.enableVertexAttribArray(u3NormalAttributeLocation);
            }

            // Generate uv array

            if(u3UvAttributeLocation > -1) {
                const uvArray = new Float32Array(mesh.indices.length * 2);

                for(let i = 0; i < mesh.indices.length; i++) {
                    let uv = mesh.uvs[mesh.indices[i]];

                    uvArray[i * 2] = uv.x;
                    uvArray[i * 2 + 1] = uv.y;
                }

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, uvArray, this.gl.DYNAMIC_DRAW);
                this.gl.vertexAttribPointer(u3UvAttributeLocation, 2, this.gl.FLOAT, true, 0, 0);
                this.gl.enableVertexAttribArray(u3UvAttributeLocation);
            }

            // Generate vertices buffer
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

            // Get vertices array
            const verticesArray: Float32Array = new Float32Array(mesh.indices.length * 3);

            for(let i = 0; i < mesh.indices.length; i++) {
                verticesArray[i * 3] = mesh.vertices[mesh.indices[i]].x;
                verticesArray[i * 3 + 1] = mesh.vertices[mesh.indices[i]].y;
                verticesArray[i * 3 + 2] = mesh.vertices[mesh.indices[i]].z;
            }

            /**
            *****************************************************************************
            *                              SETUP UNIFORMS                               *
            *****************************************************************************
            */

            // To have this done with one "for"
            const uniforms = shader.vertex.uniforms.concat(shader.fragment.uniforms);
            const params = mesh.material.getUniforms();

            for(const uniform of uniforms) {
                const location = this.gl.getUniformLocation(shader.program, uniform.name);
                let value;

                for(const param of params) {
                    if(param.name === uniform.name) {
                        value = param.value;
                        break;
                    }
                }

                switch(uniform.type) {
                    case "f1": {
                        this.gl.uniform1f(location, value);
                        break;
                    }
                    case "f1v": {
                        this.gl.uniform1fv(location, value);
                        break;
                    }
                    case "f2v":
                    case "f2": {
                        this.gl.uniform2fv(location, value);
                        break;
                    }
                    case "f3":
                    case "f3v": {
                        this.gl.uniform3fv(location, value);
                        break;
                    }
                    case "f4":
                    case "f4v": {
                        this.gl.uniform4fv(location, value);
                        break;
                    }
                    case "i1": {
                        this.gl.uniform1i(location, value);
                        break;
                    }
                    case "i2": {
                        this.gl.uniform2iv(location, value);
                        break;
                    }
                    case "i3": {
                        this.gl.uniform3iv(location, value);
                        break;
                    }
                    case "i4": {
                        this.gl.uniform4iv(location, value);
                        break;
                    }
                    case "mat2": {
                        this.gl.uniformMatrix2fv(location, false, value);
                        break;
                    }
                    case "mat3": {
                        this.gl.uniformMatrix3fv(location, false, value);
                        break;
                    }
                    case "mat4": {
                        this.gl.uniformMatrix4fv(location, false, value);
                        break;
                    }
                    case "texture2D": {
                        // TODO: The same texture may be used for different uniforms
                        this.gl.activeTexture(this.gl.TEXTURE0 + textureCount);

                        // Find texture
                        for(const texture of this.textures) {
                            if(texture.texture === value) {
                                this.gl.bindTexture(this.gl.TEXTURE_2D, texture.buffer);
                                break;
                            }
                        }

                        this.gl.uniform1i(location, textureCount);
                        textureCount++;
                        break;
                    }
                    case "texture3D": {
                        // Do that only if WebGL2 is available
                        if(this.gl.type === "WebGL2RenderingContext") {
                            // TODO: The same texture may be used for different uniforms
                            this.gl.activeTexture(this.gl.TEXTURE0 + textureCount);

                            for(const texture of this.textures) {
                                if(texture.texture === value) {
                                    this.gl.bindTexture(this.gl.TEXTURE_3D, texture.buffer);
                                    break;
                                }
                            }

                            this.gl.uniform1i(location, textureCount);
                            textureCount++;
                        }
                        break;
                    }
                }
            }

            // Set vertices and draw mesh
            this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesArray, this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(positionAttributeLocation, 3, this.gl.FLOAT, true, 0, 0);
            this.gl.enableVertexAttribArray(positionAttributeLocation);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.indices.length);
        }
    }

    /**
     * Returns GLenum constant depending on texels array type ( Uint16Array -> GL_UNSIGNED_SHORT, etc. )
     * @param data - array
     * @returns GLenum
     */
    private texFormatToGLenum<T extends TextureOptions = TextureOptions>(data: TextureOptsToArrayType<T>): GLenum {
        if(data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
            return this.gl.UNSIGNED_BYTE;
        } else if(data instanceof Int8Array && this.gl.type === "WebGL2RenderingContext") {
            return this.gl.BYTE;
        } else if(data instanceof Uint16Array) {
            if(this.gl.type === "WebGL2RenderingContext") {
                return this.gl.UNSIGNED_SHORT;
            }
        } else if(data instanceof Int16Array) {
            if(this.gl.type === "WebGL2RenderingContext") {
                return this.gl.SHORT;
            }
        } else if(data instanceof Uint32Array) {
            if(this.gl.type === "WebGL2RenderingContext") {
                return this.gl.UNSIGNED_INT;
            }
        } else if(data instanceof Int32Array) {
            if(this.gl.type === "WebGL2RenderingContext") {
                return this.gl.INT;
            }
        } else if(data instanceof Float32Array) {
            if(this.gl.type === "WebGL2RenderingContext") {
                return this.gl.FLOAT;
            }
        }
    }
}