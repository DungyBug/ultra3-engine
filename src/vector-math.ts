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
    }
};