interface IGLTFChunk {
    chunkLength: number;
    chunkType: number;
    chunkData: Uint8Array;
}

export default IGLTFChunk;