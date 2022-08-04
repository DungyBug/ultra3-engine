import PostEffectEvents from "./contracts/post-effect-events";
import { EventEmitter } from "../core/services/event-emitter";
import BaseMaterial from "./base-material";
import ClientEngine from "./client-engine";
import { IShader } from "./contracts/shader";
import { IKey, IKeyType } from "../core/contracts/base/key";
import Scene from "./scene";
import RenderTexture from "./texture/render-texture";
import IPostEffectOpts from "./contracts/post-effect-opts";
import TextureFormat from "./constants/texture-format";
import SamplingMode from "./constants/sampling-mode";
import BaseCamera from "./camera";
import Vector from "../core/lib/vector";
import CullMode from "./constants/cull-mode";

class PostEffect extends BaseMaterial {
    readonly renderTexture: RenderTexture;
    readonly emitter: EventEmitter<PostEffectEvents>;
    protected readonly _vertexShader: string;
    protected readonly _fragmentShader: string;
    protected readonly _name: string;
    protected readonly _params: Array<IKeyType>;

    constructor(opts: IPostEffectOpts, engine: ClientEngine) {
        super(engine, {cullMode: CullMode.NONE}, false);
        const graphicsModule = engine.getGraphicsModule();
        this._name = opts.name;
        this._vertexShader = opts.vertexShader;
        this._fragmentShader = opts.fragmentShader;
        this._params = opts.params;
        this.emitter = new EventEmitter();
        this.renderTexture = new RenderTexture({
            textureFormat: opts.textureFormat || TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE,
            width: opts.width || graphicsModule.width,
            height: opts.height || graphicsModule.height,
            magSamplingMode: SamplingMode.NEAREST,
            minSamplingMode: opts.samplingMode || SamplingMode.BILINEAR,
            attachment: "color",
            camera: new BaseCamera({
                position: new Vector(0, 0, -1),
                fov: Math.PI / 2
            })
        }, engine);

        this.register();
    }

    get name(): string {
        return this._name;
    }
    
    getUniforms(scene: Scene): Array<IKey> {
        const out = this.emitter.emit("getuniforms", scene);

        if(out.length > 0) {
            return [
                ...out[0],
                {
                    name: "textureSampler",
                    type: "texture2D",
                    value: this.renderTexture
                }
            ];
        } else {
            return [{
                name: "textureSampler",
                type: "texture2D",
                value: this.renderTexture
            }];
        }
    }

    getVertexShader(): IShader {
        return {
            params: this._params,
            name: this._name,
            type: "vertex",
            source: this._vertexShader
        }
    }

    getFragmentShader(): IShader {
        return {
            params: [
                ...this._params,
                {
                    name: "textureSampler",
                    type: "texture2D",
                }
            ],
            name: this._name,
            type: "fragment",
            source: this._fragmentShader
        }
    }
}

export default PostEffect;