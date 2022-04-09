/**
 * OpenGL draw mode.
 * Static mode means that mesh doesn't moves, rotates and scales. Verticies data modifies once.
 * Dynamic mode means that mesh can move, rotate or scale. Verticies data modifies repeatedly.
 */

enum DrawMode {
    STATIC,
    DYNAMIC,
}

export default DrawMode;
