interface IGLTFImage {
    type: "image";
    name: string;
    data: Uint8Array;
}

interface IGLTFBinaryFile {
    type: "binary";
    name: string;
    data: ArrayBuffer;
}

type IGLTFFile = IGLTFImage | IGLTFBinaryFile;

export default IGLTFFile;