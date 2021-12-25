interface IGLTFExtensionable {
    extensions?: Record<string, any>;
    extras?: any; // string | number | boolean | Array<string | number | boolean> | Record<string, any>
}

export default IGLTFExtensionable;