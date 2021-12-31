export function convertToFloat(array: Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Float32Array): Float32Array {
    if(array instanceof Float32Array) {
        return array;
    }

    let floatArray = new Float32Array(array.length);

    for (let i = 0; i < array.length; i++) {
        if (array instanceof Int8Array) {
            floatArray[i] = Math.max(array[i] / 127, -1.0);
        } else if (array instanceof Int16Array) {
            floatArray[i] = Math.max(array[i] / 32767, -1.0);
        } else {
            floatArray[i] = array[i] / (256 ** array.BYTES_PER_ELEMENT - 1);
        }
    }

    return floatArray;
}