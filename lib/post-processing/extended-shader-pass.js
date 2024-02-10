import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
/**
 * A slightly more sophisticated ShaderPass that automatically handles updating
 * a time uniform if available. Also allows to directly modify uniforms and
 * have an initial uniform list.
 */
class ExtendedShaderPass extends ShaderPass {
    /**
     * Create a new shader pass with the given parameters.
     *
     * @param shader The shader to use
     * @param initialUniforms An object containing the keys and values of the
     * desired initial uniform
     * @param textureID What is the name of the shader's input texture uniform,
     * default 'tDiffuse'
     * @param timeID What is the name of the shader's time uniform, default is
     * 'time'
     */
    constructor(shader, initialUniforms, textureID, timeID) {
        super(shader, textureID);
        if (initialUniforms)
            this._initUniforms(initialUniforms);
        this._timeId = timeID !== null && timeID !== void 0 ? timeID : 'time';
    }
    // initalize the uniforms given in the constructor.
    _initUniforms(uniforms) {
        for (const key of Object.keys(uniforms)) {
            this.setUniform(key, uniforms[key]);
        }
    }
    /**
     * Automatically handle time changes, then call the super method.
     *
     * @override
     */
    render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
        if (this.uniforms[this._timeId]) {
            this.uniforms[this._timeId].value += deltaTime;
        }
        super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive);
    }
    /**
     * Change the value of a uniform.
     *
     * @param key The uniform's key.
     * @param value The uniform's new value.
     */
    setUniform(key, value) {
        if (!this.uniforms[key]) {
            //console.warn(`Can't find uniform ${key}`);
            return;
        }
        this.uniforms[key].value = value;
    }
}
export { ExtendedShaderPass };
