import { IVector } from "../contracts/base/vector";

class Vector implements IVector {
    x: number;
    y: number;
    z: number;

    constructor(x: number = 0, y: number = x, z: number = y) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static from(vector: IVector) {
        return new Vector(vector.x, vector.y, vector.z);
    }

    set(v: IVector) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    magnitude() {
        return Math.hypot(this.x, this.y, this.z);
    }

    squaredMagnitude() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    add(a: IVector) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
    }

    sub(a: IVector) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
    }

    mul(a: IVector) {
        this.x *= a.x;
        this.y *= a.y;
        this.z *= a.z;
    }

    div(a: IVector) {
        this.x /= a.x;
        this.y /= a.y;
        this.z /= a.z;
    }
    
    cross(a: IVector): void {
        const x = this.x, y = this.y, z = this.z;
        this.x = a.y * z - a.z * y;
        this.y = a.z * x - a.x * z;
        this.z = a.x * y - a.y * x;
    }

    normalize(): void {
        const len = Math.hypot(this.x, this.y, this.z);
        this.x /= len;
        this.y /= len;
        this.z /= len;
    }

    dot(a: IVector): number {
        return a.x * this.x + a.y * this.y + a.z * this.z;
    }

    static add(a: IVector, b: IVector): Vector {
        return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static sub(a: IVector, b: IVector): Vector {
        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static mul(a: IVector, b: IVector): Vector {
        return new Vector(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    static normalize(a: IVector): Vector {
        const len = Math.hypot(a.x, a.y, a.z);
        return new Vector(a.x / len, a.y / len, a.z / len);
    }

    static div(a: IVector, b: IVector): Vector {
        return new Vector(a.x / b.x, a.y / b.y, a.z / b.z);
    }

    static cross(a: IVector, b: IVector): Vector {
        return new Vector(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }

    static dot(a: IVector, b: IVector): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static distance(a: IVector, b: IVector): number {
        return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static magnitude(a: IVector): number {
        return Math.hypot(a.x, a.y, a.z);
    }

    /**
     * Creates new vector with all x, y and z equal 0.
     * Creating new vector istead of using just static constant is preffered as you may use
     * vectors by link and you don't want your vector to change suddenly.
     * @returns zero vector
     */
    static zero(): Vector {
        return new Vector(0, 0, 0);
    }
}

export default Vector;