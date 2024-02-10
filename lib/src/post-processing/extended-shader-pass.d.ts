import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import * as THREE from 'three';
/**
 * A slightly more sophisticated ShaderPass that automatically handles updating
 * a time uniform if available. Also allows to directly modify uniforms and
 * have an initial uniform list.
 */
declare class ExtendedShaderPass extends ShaderPass {
    private _timeID;
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
    constructor(shader: THREE.Shader, initialUniforms?: any, textureID?: string, timeID?: string);
    private _initUniforms;
    /**
     * Automatically handle time changes, then call the super method.
     *
     * @override
     */
    render(renderer: THREE.WebGLRenderer, writeBuffer: any, readBuffer: any, deltaTime: number, maskActive: boolean): void;
    /**
     * Change the value of a uniform.
     *
     * @param key The uniform's key.
     * @param value The uniform's new value.
     */
    setUniform(key: string, value: any): void;
}
export default ExtendedShaderPass;
