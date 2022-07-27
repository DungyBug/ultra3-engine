import Vector2 from "./vector2";

type Matrix2x2 = [[number, number], [number, number]]

class Matrix2 {
    public m: Matrix2x2;

    constructor(m?: Matrix2x2) {
        this.m = m || [[1, 0], [0, 1]];
    }

    static add(a: Matrix2, b: Matrix2): Matrix2 {
        const out: Matrix2x2 = [[0, 0], [0, 0]];

        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < 2; j++) {
                out[i][j] = a.m[i][j] + b.m[i][j];
            }
        }

        return new Matrix2(out);
    }

    static subtract(a: Matrix2, b: Matrix2): Matrix2 {
        const out: Matrix2x2 = [[0, 0], [0, 0]];

        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < 2; j++) {
                out[i][j] = a.m[i][j] - b.m[i][j];
            }
        }

        return new Matrix2(out);
    }

    static multiply(a: Matrix2, b: Matrix2): Matrix2 {
        const out: Matrix2x2 = [[0, 0], [0, 0]];

        for(let r = 0; r < 2; r++) {
            for(let c = 0; c < 2; c++) {
                out[r][c] = a.m[r][0] * b.m[0][c] + a.m[r][1] * b.m[1][c];
            }
        }

        return new Matrix2(out);
    }

    
    /**
     * @brief rotation - returns rotation matrix with rotation `a`
     * @param a - angle, in radians
     */
    static rotation(a: number): Matrix2 {
        return new Matrix2([
            [Math.cos(a), -Math.sin(a)],
            [Math.sin(a), Math.cos(a)]
        ]);
    }

    add(mat: Matrix2) {
        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < 2; j++) {
                this.m[i][j] += mat.m[i][j];
            }
        }
    }

    subtract(mat: Matrix2) {
        for(let i = 0; i < 2; i++) {
            for(let j = 0; j < 2; j++) {
                this.m[i][j] -= mat.m[i][j];
            }
        }
    }

    multiply(mat: Matrix2) {
        const out: Matrix2x2 = [[0, 0], [0, 0]];
        for(let r = 0; r < 2; r++) {
            for(let c = 0; c < 2; c++) {
                out[r][c] = this.m[r][0] * mat.m[0][c] + this.m[r][1] * mat.m[1][c];
            }
        }

        this.m = out;
    }

    transpose() {
        const out: Matrix2x2 = [[0, 0], [0, 0]];
        for(let r = 0; r < 2; r++) {
            for(let c = 0; c < 2; c++) {
                out[r][c] = this.m[c][r];
            }
        }

        this.m = out;
    }

    multiplyVector(vec: Vector2): Vector2 {
        return new Vector2(
            this.m[0][0] * vec.x + this.m[0][1] * vec.y,
            this.m[1][0] * vec.x + this.m[1][1] * vec.y
        );
    }
}

export default Matrix2;