import { IVector } from "../contracts/base/vector";
import { VectorMath } from "../vector-math";

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

    length() {
        return VectorMath.getLength(this);
    }

    squaredLength() {
        return VectorMath.getSquaredLength(this);
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
}

export default Vector;