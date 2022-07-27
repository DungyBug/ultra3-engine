import IVector2D from "../contracts/base/vector2d";

class Vector2 implements IVector2D {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = x) {
        this.x = x;
        this.y = y;
    }

    static from(vector: IVector2D) {
        return new Vector2(vector.x, vector.y);
    }

    set(v: IVector2D) {
        this.x = v.x;
        this.y = v.y;
    }

    add(a: IVector2D) {
        this.x += a.x;
        this.y += a.y;
    }

    sub(a: IVector2D) {
        this.x -= a.x;
        this.y -= a.y;
    }

    mul(a: IVector2D) {
        this.x *= a.x;
        this.y *= a.y;
    }

    div(a: IVector2D) {
        this.x /= a.x;
        this.y /= a.y;
    }

    normalize(): void {
        const len = Math.hypot(this.x, this.y);
        this.x /= len;
        this.y /= len;
    }

    magnitude(): number {
        return Math.hypot(this.x, this.y);
    }

    squaredMagnitude() {
        return this.x * this.x + this.y * this.y;
    }

    dot(a: IVector2D): number {
        return a.x * this.x + a.y * this.y;
    }

    static add(a: IVector2D, b: IVector2D): Vector2 {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static sub(a: IVector2D, b: IVector2D): Vector2 {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static mul(a: IVector2D, b: IVector2D): Vector2 {
        return new Vector2(a.x * b.x, a.y * b.y);
    }

    static normalize(a: IVector2D): Vector2 {
        const len = Math.hypot(a.x, a.y);
        return new Vector2(a.x / len, a.y / len);
    }

    static div(a: IVector2D, b: IVector2D): Vector2 {
        return new Vector2(a.x / b.x, a.y / b.y);
    }

    static dot(a: IVector2D, b: IVector2D): number {
        return a.x * b.x + a.y * b.y;
    }

    static distance(a: IVector2D, b: IVector2D): number {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    static magnitude(a: IVector2D): number {
        return Math.hypot(a.x, a.y);
    }
}

export default Vector2;