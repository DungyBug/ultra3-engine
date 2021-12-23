/**
 * Type of reflection in reflectable materials
 */
enum ReflectionType {
    // Without any world reflection
    NoReflection = 'NoReflection', 
    // World reflection contains in pre-baked texture
    FixedReflection = 'FixedReflection',
    // Dynamid world reflection, world reflection texture renders every frame
    DynamicReflection = 'DynamicReflection'
};

export default ReflectionType;