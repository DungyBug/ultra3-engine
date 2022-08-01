import { BaseModuleEvents } from "../../../core/contracts/module";
import BaseModuleContext from "../../../core/contracts/module-context";
import WorldModuleEvents from "../../../core/contracts/world-module-events";
import { Entity } from "../../../core/entity";
import BaseCamera from "../../camera";
import ColorMode from "../../constants/color-mode";
import SamplingMode from "../../constants/sampling-mode";
import TextureFormat from "../../constants/texture-format";
import ClientWorldEvents from "../../contracts/client-world-events";
import IMesh from "../../contracts/mesh";
import IRegisteredMesh from "../../contracts/mesh/registered-mesh";
import ClientGraphicsModuleEvents from "../../contracts/modules/client-graphics-module-events";
import BaseGraphicsModule, { BaseGraphicsModuleEvents } from "../../contracts/modules/graphics-module";
import IGraphicsParameters from "../../contracts/modules/graphics-parameters";
import ICompiledShaders from "../../contracts/renderers/opengl-renderer/compiled-shader";
import IOpenGLRenderTextureCubemapObject from "../../contracts/renderers/opengl-renderer/cubemap-render-texture-object";
import IOpenGLRenderTextureObject from "../../contracts/renderers/opengl-renderer/render-texture-object";
import { IShader } from "../../contracts/shader";
import TextureOptions, { TextureOptsToArrayType } from "../../contracts/texture/texture-opts";
import Texture3DOptions from "../../contracts/texture/texture3d-opts";
import ViewableEntity from "../../entities/base/viewable";
import ClientMapObject from "../../map/client-object";
import Mesh from "../../mesh/mesh";
import Scene from "../../scene";
import RenderTextureCubemap from "../../texture/cubemap-render-texture";
import RenderTexture from "../../texture/render-texture";
import TextureCubemap from "../../texture/texture-cubemap";
import Texture2D from "../../texture/texture2d";
import Texture3D from "../../texture/texture3d";
import IOpenGLRendererOptions from "./contracts/opengl-renderer-opts";
import TypedWebGLRenderingContext from "./contracts/typed-webgl-context";
import { mat4 } from "./gl-matrix/index";

export default class OpenGLRenderer extends BaseGraphicsModule<ClientGraphicsModuleEvents, IOpenGLRenderTextureObject, IOpenGLRenderTextureCubemapObject> {
    public context: BaseModuleContext<WorldModuleEvents & ClientWorldEvents>
    private _width: number;
    private _height: number;
    private canvas: HTMLCanvasElement;
    private gl: TypedWebGLRenderingContext;
    private shaders: Record<string, ICompiledShaders>;
    private clientMapObjects: Array<ClientMapObject>;
    private camera: BaseCamera;
    private texturesCount: number;
    private meshes: Array<IRegisteredMesh>;
    private scene: Scene;
    private textures: Array<{
        texture: Texture2D | Texture3D | TextureCubemap;
        buffer: WebGLTexture;
        id: number;
    }>;

    constructor(opts: IOpenGLRendererOptions = {}) {
        super();
        this._width = opts.width || window.screen.width;
        this._height = opts.height || window.screen.height;
        this.canvas = opts.canvas || document.createElement("canvas");
        this.canvas.width = this._width;
        this.canvas.height = this._height;
        this.textures = [];
        this.shaders = {};
        this.camera = opts.camera || new BaseCamera();
        this.clientMapObjects = [];
        this.texturesCount = 0;
        this.meshes = [];
        this.scene = new Scene();
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    setActiveCamera(camera: BaseCamera): void {
        this.camera = camera;
    }

    getActiveCamera(): BaseCamera {
        return this.camera
    }

    handleMeshRegisterEvent(mesh: Mesh) {
        const verticesBuffer = this.gl.createBuffer();
        const normalsBuffer = this.gl.createBuffer();
        const uvsBuffer = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, verticesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.verticesFlatArray, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.normalsFlatArray, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uvsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.uvsFlatArray, this.gl.STATIC_DRAW);

        this.meshes.push({
            verticesBuffer: verticesBuffer,
            normalsBuffer,
            uvsBuffer,
            mesh
        });

        mesh.on("updated", () => this.handleMeshUpdate(mesh));

        return this.meshes.length - 1;
    }

    handleMeshFreeRequest(mesh: Mesh) {
        const registeredMesh = this.meshes[mesh.id];

        this.gl.deleteBuffer(registeredMesh.verticesBuffer);
        this.gl.deleteBuffer(registeredMesh.normalsBuffer);
        this.gl.deleteBuffer(registeredMesh.uvsBuffer);

        this.meshes.splice(mesh.id, 1);

        for(let i = mesh.id; i < this.meshes.length; i++) {
            this.meshes[i].mesh.id--;
        }
    }

    handleMeshUpdate(mesh: Mesh) {
        const registeredMesh = this.meshes[mesh.id];

        // Recreate all buffers
        this.gl.deleteBuffer(registeredMesh.verticesBuffer);
        this.gl.deleteBuffer(registeredMesh.normalsBuffer);
        this.gl.deleteBuffer(registeredMesh.uvsBuffer);

        const verticesBuffer = this.gl.createBuffer();
        const normalsBuffer = this.gl.createBuffer();
        const uvsBuffer = this.gl.createBuffer();

        // Update data
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, verticesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.verticesFlatArray, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.normalsFlatArray, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uvsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.uvsFlatArray, this.gl.STATIC_DRAW);

        registeredMesh.verticesBuffer = verticesBuffer;
        registeredMesh.normalsBuffer = normalsBuffer;
        registeredMesh.uvsBuffer = uvsBuffer;
    }

    createRenderTexture(renderTexture: RenderTexture, attachment: "color" | "depth" | "stencil", width: number, height: number, format: TextureFormat, minSamplingMode: SamplingMode, magSamplingMode: SamplingMode): IOpenGLRenderTextureObject {
        // create texture for framebuffer
        const buffer = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, buffer);

        const type = this.texFormatToGLenum(format);

        const textureMinFilter = this.samplingModeToGLenum(minSamplingMode, false);
        const textureMagFilter = this.samplingModeToGLenum(magSamplingMode, false);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, textureMinFilter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, textureMagFilter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        // create framebuffer
        const framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);

        let attachmentPoint: GLenum;

        switch(attachment) {
            case "color": {
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, type, null);

                // also create depth buffer for framebuffer
                const depthBuffer = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer);
                
                this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
                this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthBuffer);
                attachmentPoint = this.gl.COLOR_ATTACHMENT0;
                break;
            }
            case "depth": {
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT16, width, height, 0, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_SHORT, null);
                attachmentPoint = this.gl.DEPTH_ATTACHMENT;
                break;
            }
            case "stencil": {
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.STENCIL_INDEX8, width, height, 0, this.gl.RGBA, this.gl.FLOAT, null);

                // also create depth buffer for framebuffer
                const depthBuffer = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer);
                
                this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
                this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthBuffer);

                attachmentPoint = this.gl.STENCIL_ATTACHMENT;
                break;
            }
            default: {
                attachmentPoint = this.gl.NONE;
                break;
            }
        }

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachmentPoint, this.gl.TEXTURE_2D, buffer, 0);

        this.textures.push({
            texture: renderTexture,
            buffer,
            id: this.texturesCount
        });
        this.texturesCount++;

        // Unbind all
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);

        return {
            width,
            height,
            texture: buffer,
            framebuffer,
            id: this.texturesCount - 1
        };
    }

    renderToRenderTexture(object: IOpenGLRenderTextureObject, scene: Scene): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, object.framebuffer);

        this.gl.bindTexture(this.gl.TEXTURE_2D, object.texture);
        this.gl.viewport(0, 0, object.width, object.height);

        // remove texture for a while to avoid accessing texture in shaders to which we're going render to
        let oldTexture;

        for(let i = 0; i < this.textures.length; i++) {
            if(this.textures[i].id === object.id) {
                oldTexture = this.textures[i];
                this.textures.splice(i, 1);
                break;
            }
        }
        const meshes = [];

        for(const entity of scene.entities) {
            if(entity instanceof ViewableEntity) {
                meshes.push(this.meshes[entity.model.id]);
            }
        }

        for(const mapObject of scene.mapobjects) {
            meshes.push(this.meshes[mapObject.mesh.id]);
        }

        this.renderScene(false, object.width, object.height, meshes, scene);
        this.textures.push(oldTexture);
    }

    freeRenderTexture(object: IOpenGLRenderTextureObject): void {
        this.gl.deleteFramebuffer(object.framebuffer);
        this.gl.deleteTexture(object.texture);

        for(let i = 0; i < this.textures.length; i++) {
            if(this.textures[i].id === object.id) {
                this.textures.splice(i, 1);
                break;
            }
        }
    }

    createRenderTextureCubemap(renderTextureCubemap: RenderTextureCubemap<TextureFormat>, attachment: "color" | "depth" | "stencil", size: number, format: TextureFormat, minSamplingMode: SamplingMode, magSamplingMode: SamplingMode): IOpenGLRenderTextureCubemapObject {
        const buffer = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, buffer);

        const type = this.texFormatToGLenum(format);

        const textureMinFilter = this.samplingModeToGLenum(minSamplingMode, false);
        const textureMagFilter = this.samplingModeToGLenum(magSamplingMode, false);

        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, textureMinFilter);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, textureMagFilter);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        // create framebuffers
        const framebuffers = [
            { framebuffer: this.gl.createFramebuffer(), target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X},
            { framebuffer: this.gl.createFramebuffer(), target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X},
            { framebuffer: this.gl.createFramebuffer(), target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y},
            { framebuffer: this.gl.createFramebuffer(), target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y},
            { framebuffer: this.gl.createFramebuffer(), target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z},
            { framebuffer: this.gl.createFramebuffer(), target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z}
        ];

        for(const framebuffer of framebuffers) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer.framebuffer);
            let attachmentPoint: GLenum;

            switch(attachment) {
                case "color": {
                    this.gl.texImage2D(framebuffer.target, 0, this.gl.RGBA, size, size, 0, this.gl.RGBA, type, null);

                    // also create depth buffer for framebuffer
                    const depthBuffer = this.gl.createRenderbuffer();
                    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer);
                    
                    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, size, size);
                    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthBuffer);
                    attachmentPoint = this.gl.COLOR_ATTACHMENT0;
                    break;
                }
                case "depth": {
                    this.gl.texImage2D(framebuffer.target, 0, this.gl.DEPTH_COMPONENT16, size, size, 0, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_SHORT, null);
                    attachmentPoint = this.gl.DEPTH_ATTACHMENT;
                    break;
                }
                case "stencil": {
                    this.gl.texImage2D(framebuffer.target, 0, this.gl.STENCIL_INDEX8, size, size, 0, this.gl.RGBA, this.gl.FLOAT, null);

                    // also create depth buffer for framebuffer
                    const depthBuffer = this.gl.createRenderbuffer();
                    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer);
                    
                    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, size, size);
                    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthBuffer);

                    attachmentPoint = this.gl.STENCIL_ATTACHMENT;
                    break;
                }
                default: {
                    attachmentPoint = this.gl.NONE;
                    break;
                }
            }

            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachmentPoint, framebuffer.target, buffer, 0);
        }

        this.textures.push({
            texture: renderTextureCubemap,
            buffer,
            id: this.texturesCount
        });
        this.texturesCount++;

        // Unbind all
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);

        return {
            size,
            texture: buffer,
            framebufferPositiveX: framebuffers[0].framebuffer,
            framebufferNegativeX: framebuffers[1].framebuffer,
            framebufferPositiveY: framebuffers[2].framebuffer,
            framebufferNegativeY: framebuffers[3].framebuffer,
            framebufferPositiveZ: framebuffers[4].framebuffer,
            framebufferNegativeZ: framebuffers[5].framebuffer,
            id: this.texturesCount - 1
        }
    }

    renderToRenderTextureCubemap(object: IOpenGLRenderTextureCubemapObject, coordinate: "+x" | "+y" | "+z" | "-x" | "-y" | "-z", scene: Scene): void {
        // remove texture for a while to avoid accessing texture in shaders to which we're going render to

        switch(coordinate) {
            case "+x": {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, object.framebufferPositiveX);
                break;
            }
            case "+y": {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, object.framebufferPositiveY);
                break;
            }
            case "+z": {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, object.framebufferPositiveZ);
                break;
            }
            case "-x": {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, object.framebufferNegativeX);
                break;
            }
            case "-y": {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, object.framebufferNegativeY);
                break;
            }
            case "-z": {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, object.framebufferNegativeZ);
                break;
            }
        }
        this.gl.viewport(0, 0, object.size, object.size);

        let oldTexture;

        for(let i = 0; i < this.textures.length; i++) {
            if(this.textures[i].id === object.id) {
                oldTexture = this.textures[i];
                this.textures.splice(i, 1);
                break;
            }
        }

        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, object.texture);
        const meshes = [];

        for(const entity of scene.entities) {
            if(entity instanceof ViewableEntity) {
                meshes.push(this.meshes[entity.model.id]);
            }
        }

        for(const mapObject of scene.mapobjects) {
            meshes.push(this.meshes[mapObject.mesh.id]);
        }

        this.renderScene(false, object.size, object.size, meshes, scene);
        this.textures.push(oldTexture);
    }

    freeRenderTextureCubemap(object: IOpenGLRenderTextureCubemapObject): void {
        this.gl.deleteFramebuffer(object.framebufferPositiveX);
        this.gl.deleteFramebuffer(object.framebufferPositiveY);
        this.gl.deleteFramebuffer(object.framebufferPositiveZ);
        this.gl.deleteFramebuffer(object.framebufferNegativeX);
        this.gl.deleteFramebuffer(object.framebufferNegativeY);
        this.gl.deleteFramebuffer(object.framebufferNegativeZ);
        this.gl.deleteTexture(object.texture);

        for(let i = 0; i < this.textures.length; i++) {
            if(this.textures[i].id === object.id) {
                this.textures.splice(i, 1);
                break;
            }
        }
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

        let type: GLenum = this.arrayTypeToGLenum(data);

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
            buffer,
            id: this.texturesCount
        });
        this.texturesCount++;

        return this.texturesCount - 1;
    }

    updateTexture2D(textureId: number, time: number, timedelta: number) {
        let id = 0;
        for(let i = 0; i < this.textures.length; i++) {
            if(this.textures[i].id === textureId) {
                id = i;
                break;
            }
        }
        const {texture, buffer} = this.textures[id];

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

        let type: GLenum = this.arrayTypeToGLenum(data);

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
    
            let type: GLenum = this.arrayTypeToGLenum(data);
    
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
                buffer,
                id: this.texturesCount
            });
            this.texturesCount++;
    
            return this.texturesCount - 1;
        } else {
            console.warn("OpenGLRenderer: attempt to create unsupported texture3D.");
            return -1;
        }
    }

    updateTexture3D(textureId: number, time: number, timedelta: number) {
        if(this.gl.type === "WebGL2RenderingContext") {
            let id = 0;
            for(let i = 0; i < this.textures.length; i++) {
                if(this.textures[i].id === textureId) {
                    id = i;
                    break;
                }
            }
            const {texture, buffer} = this.textures[id];

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

            let type: GLenum = this.arrayTypeToGLenum(data);

            this.gl.bindTexture(this.gl.TEXTURE_3D, buffer);
            this.gl.texImage3D(this.gl.TEXTURE_3D, 0, mode, texture.dimensions[0], texture.dimensions[1], texture.dimensions[2], 0, mode, type, data);
        }
    }

    createTextureCubemap<T extends TextureOptions = TextureOptions>(texture: TextureCubemap<T>): number {
        const buffer = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, buffer);
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

        let data = texture.getFrame(0, "+x");
        let type: GLenum = this.arrayTypeToGLenum(data);

        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);

        data = texture.getFrame(0, "-x");
        type = this.arrayTypeToGLenum(data);

        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);

        data = texture.getFrame(0, "+y");
        type = this.arrayTypeToGLenum(data);

        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);

        data = texture.getFrame(0, "-y");
        type = this.arrayTypeToGLenum(data);

        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);

        data = texture.getFrame(0, "+z");
        type = this.arrayTypeToGLenum(data);

        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);

        data = texture.getFrame(0, "-z");
        type = this.arrayTypeToGLenum(data);

        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);


        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

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
    
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, minSamplingMode);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, magSamplingMode);
        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);

        this.textures.push({
            texture,
            buffer,
            id: this.texturesCount
        });
        this.texturesCount++;

        return this.texturesCount - 1;
    }

    updateTextureCubemap(textureId: number, time: number, timedelta: number) {
        let id = 0;
        for(let i = 0; i < this.textures.length; i++) {
            if(this.textures[i].id === textureId) {
                id = i;
                break;
            }
        }
        const {texture, buffer} = this.textures[id];

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
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, buffer);
        
        let data = texture.getRawData(time, "+x");
        let type: GLenum = this.arrayTypeToGLenum(data);

        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);

        data = texture.getRawData(time, "-x");
        type = this.arrayTypeToGLenum(data);
        
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);

        data = texture.getRawData(time, "+y");
        type = this.arrayTypeToGLenum(data);
        
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);

        data = texture.getRawData(time, "-y");
        type = this.arrayTypeToGLenum(data);
        
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);

        data = texture.getRawData(time, "+z");
        type = this.arrayTypeToGLenum(data);
        
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);

        data = texture.getRawData(time, "-z");
        type = this.arrayTypeToGLenum(data);
        
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, mode, texture.dimensions[0], texture.dimensions[1], 0, mode, type, data);
        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
    }

    freeTexture(textureId: number): void {
        this.gl.deleteTexture(this.textures[textureId].buffer);
        this.textures.splice(textureId, 1);
    }

    init(parameters: IGraphicsParameters & { context: BaseModuleContext<BaseGraphicsModuleEvents & BaseModuleEvents>; }): void {
        super.init(parameters);
        this._width = parameters.width;
        this._height = parameters.height;
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

        this.context.emitter.on("frameend", this.render.bind(this));
        this.context.emitter.on("clientmapobject", this.handleClientMapObject.bind(this));
        this.context.emitter.on("meshRegistered", (mesh) => this.handleMeshRegisterEvent(mesh));
        this.context.emitter.on("newEntity", (ent) => this.scene.pushEntity(ent));
        this.context.emitter.on("entityDelete", (ent) => this.scene.removeEntity(ent));
        this.context.emitter.on("meshFreeRequest", (mesh) => this.handleMeshFreeRequest(mesh));
    }

    handleClientMapObject(object: ClientMapObject) {
        this.clientMapObjects.push(object);
        this.scene.pushMapObject(object);
    }

    setParams(parameters: Partial<IGraphicsParameters>) {
        this._width = parameters.width || this.width;
        this._height = parameters.height || this.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.gl.viewport(0, 0, this.width, this.height);
    }

    render(scene?: Scene) {
        this.gl.viewport(0, 0, this.width, this.height);

        if(scene) {
            const meshes: Array<IRegisteredMesh> = [];

            for(const entity of scene.entities) {
                if(entity instanceof ViewableEntity) {
                    meshes.push(this.meshes[entity.model.id]);
                }
            }

            for(const mapobject of scene.mapobjects) {
                meshes.push(this.meshes[mapobject.mesh.id]);
            }

            this.renderScene(true, this.width, this.height, meshes, scene);
        } else {
            this.renderScene(true, this.width, this.height, this.meshes, this.scene);
        }
    }

    private renderScene(directDraw: boolean, width: number, height: number, meshes: Array<IRegisteredMesh>, scene: Scene) {
        if(directDraw) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }

        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, this.camera.fov, width / height, this.camera.zNear, this.camera.zFar);

        const cameraViewMatrix = mat4.create();
        mat4.rotateX(cameraViewMatrix, cameraViewMatrix, this.camera.rotation.x);
        mat4.rotateY(cameraViewMatrix, cameraViewMatrix, this.camera.rotation.y);
        mat4.rotateZ(cameraViewMatrix, cameraViewMatrix, this.camera.rotation.z);
        mat4.translate(cameraViewMatrix, cameraViewMatrix, [
            this.camera.position.x, this.camera.position.y, this.camera.position.z
        ]);

        for(const registeredMesh of meshes) {
            const mesh = registeredMesh.mesh;
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
                const buffer = registeredMesh.normalsBuffer;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
                // this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.normalsFlatArray, this.gl.DYNAMIC_DRAW);
                this.gl.vertexAttribPointer(u3NormalAttributeLocation, 3, this.gl.FLOAT, true, 0, 0);
                this.gl.enableVertexAttribArray(u3NormalAttributeLocation);
            }

            // Generate uv array

            if(u3UvAttributeLocation > -1) {
                const buffer = registeredMesh.uvsBuffer;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
                // this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.uvsFlatArray, this.gl.DYNAMIC_DRAW);
                this.gl.vertexAttribPointer(u3UvAttributeLocation, 2, this.gl.FLOAT, true, 0, 0);
                this.gl.enableVertexAttribArray(u3UvAttributeLocation);
            }

            const vertexBuffer = registeredMesh.verticesBuffer;
            // Generate vertices buffer
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

            /**
            *****************************************************************************
            *                              SETUP UNIFORMS                               *
            *****************************************************************************
            */

            // To have this done with one "for"
            const uniforms = shader.vertex.uniforms.concat(shader.fragment.uniforms);
            const params = mesh.material.getUniforms(scene);

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
                    case "textureCubemap": {
                        // Find texture
                        for(const texture of this.textures) {
                            if(texture.texture === value) {
                                // TODO: The same texture may be used for different uniforms
                                this.gl.activeTexture(this.gl.TEXTURE0 + textureCount);
                                this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, texture.buffer);
                                this.gl.uniform1i(location, textureCount);
                                textureCount++;
                                break;
                            }
                        }
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
            // this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.verticesFlatArray, this.gl.STATIC_DRAW);
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
    private arrayTypeToGLenum<T extends TextureOptions = TextureOptions>(data: TextureOptsToArrayType<T>): GLenum {
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

    /**
     * Returns GLenum constant depending on texture format ( TextureFormat.UNSIGNED_BYTE -> GL_UNSIGNED_BYTE, etc. )
     * @param format - texture format
     * @returns GLenum
     */
    private texFormatToGLenum(format: TextureFormat): GLenum {
        switch(format) {
            case TextureFormat.TEXTUREFORMAT_BYTE: {
                if(this.gl.type === "WebGL2RenderingContext") {
                    return this.gl.BYTE;
                }
                return this.gl.UNSIGNED_BYTE
                break;
            }
            case TextureFormat.TEXTUREFORMAT_FLOAT: {
                return this.gl.FLOAT;
                break;
            }
            case TextureFormat.TEXTUREFORMAT_HALF_FLOAT: {
                if(this.gl.type === "WebGL2RenderingContext") {
                    return this.gl.HALF_FLOAT;
                }
                return this.gl.NONE;
                break;
            }
            case TextureFormat.TEXTUREFORMAT_INT: {
                return this.gl.INT;
                break;
            }
            case TextureFormat.TEXTUREFORMAT_SHORT: {
                return this.gl.SHORT;
                break;
            }
            case TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE: {
                return this.gl.UNSIGNED_BYTE;
                break;
            }
            case TextureFormat.TEXTUREFORMAT_UNSIGNED_INT: {
                return this.gl.UNSIGNED_INT;
                break;
            }
            case TextureFormat.TEXTUREFORMAT_UNSIGNED_SHORT: {
                return this.gl.UNSIGNED_SHORT;
                break;
            }
        }

        return this.gl.NONE;
    }

    /**
     * Returns GLenum constant according to sampling mode
     * @param sampling - texture sampling
     * @param mipmap - return constant with mipmap definition or not (LINEAR -> LINEAR_MIPMAP_LINEAR)
     * @returns GLenum
     */
    samplingModeToGLenum(sampling: SamplingMode, mipmap: boolean = false): GLenum {
        switch(sampling) {
            case SamplingMode.BILINEAR: {
                if(mipmap) {
                    return this.gl.LINEAR_MIPMAP_NEAREST;
                }
                return this.gl.LINEAR;
                break;
            }
            case SamplingMode.BICUBIC:
            case SamplingMode.TRILINEAR: {
                if(mipmap) {
                    return this.gl.LINEAR_MIPMAP_LINEAR;
                }
                return this.gl.LINEAR;
                break;
            }
            case SamplingMode.NEAREST: {
                if(mipmap) {
                    return this.gl.NEAREST_MIPMAP_NEAREST;
                }
                return this.gl.NEAREST;
                break;
            }

            default: {
                return this.gl.NONE;
                break;
            }
        }
    }
}