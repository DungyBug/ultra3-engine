interface IGLTFAttributes {
    NORMAL?: number;
    POSITION: number;
    TANGENT?: number;
    [k: `TEXCOORD_${number}`]: number;
    [k: `COLOR_${number}`]: number;
    [k: `JOINTS_${number}`]: number;
    [k: `WEIGHTS_${number}`]: number;
    [k: `_${string}`]: number;

    // Not allowed expressions
    _?: never;
    [k: `TEXCOORD_0${number}`]: never;
    [k: `COLOR_0${number}`]: never;
    [k: `JOINTS_0${number}`]: never;
    [k: `WEIGHTS_0${number}`]: never;
}

export default IGLTFAttributes;