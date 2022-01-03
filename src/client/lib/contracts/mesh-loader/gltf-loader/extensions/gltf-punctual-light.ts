interface IGLTFBasePunctualLight {
    name?: string;
    color?: [number, number, number];
    type: "directional" | "point" | "spot";
    intensity?: number;
    range?: number;
}

interface IGLTFSpotLight extends IGLTFBasePunctualLight {
    type: "spot";
    innerConeAngle?: number;
    outerConeAngle?: number;
}

interface IGLTFDirectionalLight extends IGLTFBasePunctualLight {
    type: "directional";
}

interface IGLTFPointLight extends IGLTFBasePunctualLight {
    type: "point";
}

interface IGLTFExtesionPunctualLight {
    lights: Array<IGLTFSpotLight | IGLTFDirectionalLight | IGLTFPointLight>;
}

export interface IGLTFNodeExtesionPunctualLight {
    light: number;
}

export default IGLTFExtesionPunctualLight;