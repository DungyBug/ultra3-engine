import ClientEngine from "./client-engine";
import ClientWorld from "./client-world";
import { Registry } from "../core/registry";
import TestGraphicsModule from "./test-assets/test-graphics-module";
import ColoredMaterial from "./materials/colored-material";
import Mesh from "./mesh/mesh";
import Texture2D from "./texture/texture2d";
import TextureFormat from "./constants/texture-format";
import ColorMode from "./constants/color-mode";
import SamplingMode from "./constants/sampling-mode";
import Texture3D from "./texture/texture3d";
import TextureCubemap from "./texture/texture-cubemap";
import RenderTexture from "./texture/render-texture";
import RenderTextureCubemap from "./texture/cubemap-render-texture";
import Scene from "./scene";

describe("ClientEngine", () => {
    let clientWorld: ClientWorld;
    let clientEngine: ClientEngine;
    let graphicsModule: TestGraphicsModule;
    
    const mockAllMethods = <T extends {}>(toMock: T) => Object.getOwnPropertyNames(Object.getPrototypeOf(toMock)).forEach(key => {
        if (typeof toMock[key as keyof T] === 'function') {
            jest.spyOn(toMock, key as any);
        }
    });

    beforeAll(() => {
        clientWorld = new ClientWorld({
            repeatThink: false // renerLoop stops after first think ( tick )
        }, new Registry());

        // Spy on methods
        // I don't use jest.mock("./path") 'cause it replaces methods with it's own
        // dummies which return undefined
        mockAllMethods(clientWorld);

        clientEngine = new ClientEngine(clientWorld);

        graphicsModule = new TestGraphicsModule();
        mockAllMethods(graphicsModule);
        
        clientEngine.setGraphicsModule(graphicsModule, 800, 600);

        expect(graphicsModule.init).toBeCalledTimes(1);
    });

    it("should register shader", () => {
        const material = new ColoredMaterial(clientEngine);

        expect(graphicsModule.registerShader).toBeCalledWith(material.name, material.getVertexShader(), material.getFragmentShader());
    });

    it("should register and free mesh", () => {
        const context = graphicsModule.privateContext;

        const meshRegistered = jest.fn().mockImplementation(() => {});
        const meshFreeRequest = jest.fn().mockImplementation(() => {});

        context.emitter.on("meshRegistered", meshRegistered);
        context.emitter.on("meshFreeRequest", meshFreeRequest);
        
        const mesh = new Mesh({}, clientEngine);

        expect(meshRegistered).toBeCalledWith(mesh);

        mesh.free();

        expect(meshFreeRequest).toBeCalledWith(mesh);
    });

    it("should register and free textures", () => {
        // **************************************
        // *  CREATING AND REGISTERING TEXTURES
        // **************************************

        const textureOptions = {
            colorMode: ColorMode.RGB,
            framesPerSecond: 0,
            magSamplingMode: SamplingMode.BILINEAR,
            minSamplingMode: SamplingMode.BILINEAR,
            frames: [],
            textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE
        }

        const texture2d = new Texture2D({
            ...textureOptions,
            width: 128, height: 128
        }, clientEngine);

        const texture3d = new Texture3D({
            ...textureOptions,
            width: 64, height: 64, depth: 64,
        }, clientEngine);

        const textureCubemap = new TextureCubemap({
            ...textureOptions,
            width: 64, height: 64
        }, clientEngine);

        const renderTexture = new RenderTexture({
            ...textureOptions,
            width: 640, height: 480,
            attachment: "color"
        }, clientEngine);

        const renderTextureCubemap = new RenderTextureCubemap({
            ...textureOptions,
            size: 1024,
            attachment: "depth"
        }, clientEngine);

        expect(graphicsModule.createTexture2D).toBeCalledWith(texture2d);
        expect(graphicsModule.createTexture3D).toBeCalledWith(texture3d);
        expect(graphicsModule.createTextureCubemap).toBeCalledWith(textureCubemap);
        expect(graphicsModule.createRenderTexture).toBeCalledWith(renderTexture, "color", 640, 480, textureOptions.textureFormat, textureOptions.minSamplingMode, textureOptions.magSamplingMode);
        expect(graphicsModule.createRenderTextureCubemap).toBeCalledWith(renderTextureCubemap, "depth", 1024, textureOptions.textureFormat, textureOptions.minSamplingMode, textureOptions.magSamplingMode);

        // **************************************
        // *  DELETING TEXTURES
        // **************************************

        texture2d.free();
        expect(graphicsModule.freeTexture).toHaveBeenNthCalledWith(1, 0);

        texture3d.free();
        expect(graphicsModule.freeTexture).toHaveBeenNthCalledWith(2, 1);

        textureCubemap.free();
        expect(graphicsModule.freeTexture).toHaveBeenNthCalledWith(3, 2);

        renderTexture.free();
        renderTextureCubemap.free();

        expect(graphicsModule.freeRenderTexture).toBeCalled();
        expect(graphicsModule.freeRenderTextureCubemap).toBeCalled();
    });

    it("should queue textures", () => {
        // Creating two engines is not supposed by design, but neither we nor the engine do
        // nothing with world
        const engine = new ClientEngine(clientWorld);

        const testGraphicsModule = new TestGraphicsModule();

        mockAllMethods(testGraphicsModule);

        const textureOptions = {
            colorMode: ColorMode.RGB,
            framesPerSecond: 0,
            magSamplingMode: SamplingMode.BILINEAR,
            minSamplingMode: SamplingMode.BILINEAR,
            frames: [],
            textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE
        }

        const texture2dArray = [1, 2, 3, 4, 5].map(i => new Texture2D({
            ...textureOptions,
            width: i * 32, height: i * 32
        }, engine));

        const texture3dArray = [1, 2, 3, 4].map(i => new Texture3D({
            ...textureOptions,
            width: i * 32, height: i * 32, depth: i * 32
        }, engine));

        const textureCubemapArray = [1, 2, 3, 4, 5, 6].map(i => new TextureCubemap({
            ...textureOptions,
            width: i * 16, height: i * 16
        }, engine));

        // RenderTextures are not supposed to be queued

        engine.setGraphicsModule(testGraphicsModule, 640, 480);

        texture2dArray.forEach((texture2d, i) => {
            expect(testGraphicsModule.createTexture2D).toHaveBeenNthCalledWith(i + 1, texture2d);
        });

        texture3dArray.forEach((texture3d, i) => {
            expect(testGraphicsModule.createTexture3D).toHaveBeenNthCalledWith(i + 1, texture3d);
        });

        textureCubemapArray.forEach((textureCubemap, i) => {
            expect(testGraphicsModule.createTextureCubemap).toHaveBeenNthCalledWith(i + 1, textureCubemap);
        });
    });

    it("should render scene", () => {
        const engine = new ClientEngine(clientWorld);

        mockAllMethods(engine);

        const testGraphicsModule = new TestGraphicsModule();

        mockAllMethods(testGraphicsModule);

        // Engine must not throw error when graphics module is not set
        expect(() => engine.render()).not.toThrow();

        engine.setGraphicsModule(testGraphicsModule, 320, 240);

        // Renders should not queue
        expect(testGraphicsModule.render).not.toBeCalled();
        expect(testGraphicsModule.renderToRenderTexture).not.toBeCalled();

        engine.render();

        // Should be called with no arguments
        expect(testGraphicsModule.render).toBeCalledWith(undefined);

        const scene = new Scene();

        engine.render(scene);

        // Should be called with scene, despite it's empty, so no optimizaitons
        // should be also used
        expect(testGraphicsModule.render).toBeCalledWith(scene);
    });

    it("should run render loop", () => {
        const textureOptions = {
            colorMode: ColorMode.RGB,
            framesPerSecond: 0,
            magSamplingMode: SamplingMode.BILINEAR,
            minSamplingMode: SamplingMode.BILINEAR,
            frames: [],
            textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE
        }

        const texture2d = new Texture2D({
            ...textureOptions,
            width: 128, height: 128
        }, clientEngine);

        const texture3d = new Texture3D({
            ...textureOptions,
            width: 64, height: 64, depth: 64,
        }, clientEngine);

        const textureCubemap = new TextureCubemap({
            ...textureOptions,
            width: 64, height: 64
        }, clientEngine);

        clientEngine.runRenderLoop();

        expect(clientWorld.runTickLoop).toBeCalled();

        expect(graphicsModule.updateTexture2D).toBeCalled();
        expect(graphicsModule.updateTexture3D).toBeCalled();
        expect(graphicsModule.updateTextureCubemap).toBeCalled();
        
        expect(graphicsModule.render).toBeCalled();

        texture2d.free();
        texture3d.free();
        textureCubemap.free();
    });

    it("should run rener loop without graphics module", () => {
        const world = new ClientWorld({}, new Registry());

        const engine = new ClientEngine(world);

        expect(() => engine.runRenderLoop()).not.toThrow();  
    })
});