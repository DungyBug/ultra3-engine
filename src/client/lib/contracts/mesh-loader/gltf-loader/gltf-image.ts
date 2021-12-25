import IGLTFExtensionable from "./gltf-extensionable";

type FileFormats<T extends string> = `${string}.${T}`;
type Base64<T extends string> = `data:${T};base64,${string}`;
type SupportedMimeTypes = "image/png" | "image/jpeg";

interface IGLTFBaseImage extends IGLTFExtensionable {
    name?: string;
}

interface IGLTFImageStoredByURI extends IGLTFBaseImage {
    [k: string]: any;
    uri?: FileFormats<"png" | "jpeg" | "jpg"> | Base64<SupportedMimeTypes>;
    bufferView?: never;
    mimeType?: SupportedMimeTypes;
}

interface IGLTFImageStoredByBuffer extends IGLTFBaseImage {
    [k: string]: any;
    uri?: never;
    bufferView: number;
    mimeType: SupportedMimeTypes;
}

type GLTFImage = IGLTFImageStoredByURI | IGLTFImageStoredByBuffer;

export default GLTFImage;