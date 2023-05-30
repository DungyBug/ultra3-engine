import Vector from "./vector";

type Matrix3x3 = [[number, number, number], [number, number, number], [number, number, number]]

class Matrix3 {
    public m: Matrix3x3;

    constructor(m?: Matrix3x3) {
        this.m = m || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }

    static add(a: Matrix3, b: Matrix3): Matrix3 {
        const out: Matrix3x3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                // @ts-ignore
                out[i][j] = a.m[i][j] + b.m[i][j];
            }
        }

        return new Matrix3(out);
    }

    static subtract(a: Matrix3, b: Matrix3): Matrix3 {
        const out: Matrix3x3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                // @ts-ignore
                out[i][j] = a.m[i][j] - b.m[i][j];
            }
        }

        return new Matrix3(out);
    }

    static multiply(a: Matrix3, b: Matrix3): Matrix3 {
        const out: Matrix3x3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        for(let r = 0; r < 3; r++) {
            for(let c = 0; c < 3; c++) {
                // @ts-ignore
                out[r][c] = a.m[r][0] * b.m[0][c] + a.m[r][1] * b.m[1][c] + a.m[r][2] * b.m[2][c];
            }
        }

        return new Matrix3(out);
    }

    
    /**
     * @brief rotationX - returns rotation matrix with rotation `a` in X axis
     * @param a - angle, in radians
     */
    static rotationX(a: number): Matrix3 {
        const s = Math.sin(a), c = Math.cos(a);
        return new Matrix3([
            [1, 0, 0],
            [0, c, s],
            [0, -s, c]
        ]);
    }

    /**
     * @brief rotationY - returns rotation matrix with rotation `a` in Y axis
     * @param a - angle, in radians
     */
    static rotationY(a: number): Matrix3 {
        const s = Math.sin(a), c = Math.cos(a);
        return new Matrix3([
            [c, 0, -s],
            [0, 1, 0],
            [s, 0, c]
        ]);
    }

    /**
     * @brief rotationZ - returns rotation matrix with rotation `a` in Z axis
     * @param a - angle, in radians
     */
    static rotationZ(a: number): Matrix3 {
        const s = Math.sin(a), c = Math.cos(a);
        return new Matrix3([
            [c, s, 0],
            [-s, c, 0],
            [0, 0, 1]
        ]);
    }

    add(mat: Matrix3) {
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                // @ts-ignore
                this.m[i][j] += mat.m[i][j];
            }
        }
    }

    subtract(mat: Matrix3) {
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                // @ts-ignore
                this.m[i][j] -= mat.m[i][j];
            }
        }
    }

    multiply(mat: Matrix3) {
        const out: Matrix3x3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for(let r = 0; r < 3; r++) {
            for(let c = 0; c < 3; c++) {
                // @ts-ignore
                out[r][c] = this.m[r][0] * mat.m[0][c] + this.m[r][1] * mat.m[1][c] + this.m[r][2] * mat.m[2][c];
            }
        }

        this.m = out;
    }

    transpose() {
        const out: Matrix3x3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for(let r = 0; r < 3; r++) {
            for(let c = 0; c < 3; c++) {
                // @ts-ignore
                out[r][c] = this.m[c][r];
            }
        }

        this.m = out;
    }

    multiplyVector(vec: Vector): Vector {
        return new Vector(
            this.m[0][0] * vec.x + this.m[0][1] * vec.y + this.m[0][2] * vec.z,
            this.m[1][0] * vec.x + this.m[1][1] * vec.y + this.m[1][2] * vec.z,
            this.m[2][0] * vec.x + this.m[2][1] * vec.y + this.m[2][2] * vec.z
        );
    }
}

export default Matrix3;