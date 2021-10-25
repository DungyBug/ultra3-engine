import { IVector } from "./contracts/base/vector";

export const VectorMath = {
    /**
     * @param vector vector to get length from
     * @returns length of this vector
     */
    getLength(vector: IVector): number {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    },

    /**
     * @param vector vector to get length from
     * @returns squared length of this vector
     * Used for optimizations
     */
    getSquaredLength(vector: IVector): number {
        return vector.x * vector.x + vector.y * vector.y + vector.z * vector.z;
    },

    // /**
    //  * @param vector - Vector
    //  * @param length - Length to compare
    //  * @returns difference between lengths
    //  * Compares vector length and given length
    //  */
    // compareLength(vector: IVector, length: number): number {
    //     let vectorLength = vector.x * vector.x + vector.y * vector.y + vector.z * vector.z;
    //     let comparingLength = length * length;

    //     return vectorLength - comparingLength;
    // },

    add(a: IVector, b: IVector): IVector {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
            z: a.z + b.z
        }
    },

    subtract(a: IVector, b: IVector): IVector {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z
        }
    },

    subdivide(a: IVector | number, b: IVector | number): IVector {
        let _a: IVector;
        let _b: IVector;

        // Convert a and b to vectors independendly from their types

        if(typeof a === "number") {
            _a = {
                x: a,
                y: a,
                z: a
            };
        } else {
            _a = {
                x: a.x,
                y: a.y,
                z: a.z
            };
        }

        if(typeof b === "number") {
            _b = {
                x: b,
                y: b,
                z: b
            };
        } else {
            _b = {
                x: b.x,
                y: b.y,
                z: b.z
            };
        }

        return {
            x: _a.x / _b.x,
            y: _a.y / _b.y,
            z: _a.z / _b.z
        }
    },

    multiply(a: IVector | number, b: IVector | number): IVector {
        let _a: IVector;
        let _b: IVector;

        // Convert a and b to vectors independendly from their types

        if(typeof a === "number") {
            _a = {
                x: a,
                y: a,
                z: a
            };
        } else {
            _a = {
                x: a.x,
                y: a.y,
                z: a.z
            };
        }

        if(typeof b === "number") {
            _b = {
                x: b,
                y: b,
                z: b
            };
        } else {
            _b = {
                x: b.x,
                y: b.y,
                z: b.z
            };
        }

        return {
            x: _a.x * _b.x,
            y: _a.y * _b.y,
            z: _a.z * _b.z
        }
    }
};