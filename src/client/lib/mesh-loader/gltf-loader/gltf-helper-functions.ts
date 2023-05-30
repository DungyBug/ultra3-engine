export function convertToFloat(array: Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Float32Array): Float32Array {
    if(array instanceof Float32Array) {
        return array;
    }

    let floatArray = new Float32Array(array.length);

    const convert = array instanceof Int8Array
                        ? (value: number) => Math.max(value / 127, -1.0)
                        : array instanceof Int16Array
                            ? (value: number) => Math.max(value / 32767, -1.0)
                            : (value: number) => value / (256 ** array.BYTES_PER_ELEMENT - 1);

    array.forEach((value, i) => {
        floatArray[i] = convert(value);
    });

    return floatArray;
}