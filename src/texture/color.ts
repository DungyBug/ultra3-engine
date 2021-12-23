import ColorMode from "../constants/color-mode";
import SamplingMode from "../constants/sampling-mode";
import TextureFormat from "../constants/texture-format";
import { IUint8TextureOptions } from "../contracts/texture/texture-opts";
import Texture2D from "./texture2d";

class ColorTexture<T extends ColorMode = ColorMode> extends Texture2D<IUint8TextureOptions & {width: 1, height: 1}> {
    constructor(colorMode: T, color: T extends ColorMode.LUMINANCE
                                                            ? number :
                                                                T extends ColorMode.ALPHA
                                                                    ? number :
                                                                    T extends ColorMode.R
                                                                        ? number :
                                                                        T extends ColorMode.LUMINANCE_ALPHA
                                                                            ? [number, number] :
                                                                            T extends ColorMode.RG
                                                                                ? [number, number] :
                                                                                T extends ColorMode.RGB
                                                                                    ? [number, number, number] :
                                                                                    T extends ColorMode.RGBA
                                                                                        ? [number, number, number, number] : never) {
        let image: Uint8Array;

        switch(colorMode) {
            case ColorMode.LUMINANCE: {
                image = new Uint8Array(1);
                image[0] = color as number;
                break;
            }
            case ColorMode.LUMINANCE_ALPHA: {
                image = new Uint8Array(2);
                image[0] = (color as Array<number>)[0];
                image[1] = (color as Array<number>)[1];
                break;
            }
            case ColorMode.ALPHA: {
                image = new Uint8Array(1);
                image[0] = color as number;
                break;
            }
            case ColorMode.R: {
                image = new Uint8Array(1);
                image[0] = color as number;
                break;
            }
            case ColorMode.RG: {
                image = new Uint8Array(2);
                image[0] = (color as Array<number>)[0];
                image[1] = (color as Array<number>)[1];
                break;
            }
            case ColorMode.RGB: {
                image = new Uint8Array(3);
                image[0] = (color as Array<number>)[0];
                image[1] = (color as Array<number>)[1];
                image[2] = (color as Array<number>)[2];
                break;
            }
            case ColorMode.RGBA: {
                image = new Uint8Array(4);
                image[0] = (color as Array<number>)[0];
                image[1] = (color as Array<number>)[1];
                image[2] = (color as Array<number>)[2];
                image[3] = (color as Array<number>)[3];
                break;
            }
        }
        
        super({
            width: 1,
            height: 1,
            frames: [image],
            framesPerSecond: 0,
            colorMode: colorMode,
            samplingMode: SamplingMode.NEAREST,
            textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE
        });
    }
}

export default ColorTexture;