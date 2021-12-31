type TypedArray = Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | Float32Array;

export type GetArrayConstructor<T extends TypedArray> = T extends Uint8Array
    ? Uint8ArrayConstructor
    : T extends Int8Array 
        ? Int8ArrayConstructor
        : T extends Uint16Array
            ? Uint16ArrayConstructor
            : T extends Int16Array
                ? Int16ArrayConstructor
                : T extends Uint32Array
                    ? Uint32ArrayConstructor
                    : T extends Int32Array
                        ? Int32ArrayConstructor
                        : T extends Float32Array
                            ? Float32ArrayConstructor
                            : never;

export default TypedArray;