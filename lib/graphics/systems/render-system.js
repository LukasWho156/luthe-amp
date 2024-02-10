import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { Game } from "../../index.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ExtendedShaderPass } from "../../post-processing/extended-shader-pass.js";
import { NoopShader } from "../../post-processing/noop-shader.js";
class RenderSystem {
    constructor() {
        this.update = (delta) => {
            // ugly hack, but for some reason, having multiple render passes without
            // any post-processing doesn't seem to work.
            if (!this._hasPostProcessingPass) {
                this.addPostProcessingPass(new ExtendedShaderPass(NoopShader));
            }
            Game.renderer.clear();
            this._composer.render(delta);
        };
        this._composer = new EffectComposer(Game.renderer);
        this._isFirstPass = true;
        this._hasPostProcessingPass = false;
    }
    /**
     * Add a render pass to the screen. This automatically adjusts the pass's
     * .clear and .clearDepth value so that rendering multiple scenes on top
     * of each other works, but if you still need to modify the created pass
     * afterwards, use the return value.
     *
     * @param scene The scene to render
     * @param camera The camera to use for rendering
     * @returns The created render pass
     */
    addRenderPass(scene, camera) {
        const pass = new RenderPass(scene, camera);
        if (this._isFirstPass) {
            this._isFirstPass = false;
            this._composer.addPass(pass);
            return pass;
        }
        pass.clear = false;
        pass.clearDepth = true;
        this._composer.addPass(pass);
        return pass;
    }
    /**
     * Add a postprocessing pass to the scene.
     *
     * Note that render passes and postprocessing passes share the same array,
     * so if you want to make sure that postprocessing is done after all scenes
     * have been rendered, only use this method after all render passes have
     * been added.
     *
     * @param pass The postprocessing pass
     */
    addPostProcessingPass(pass) {
        this._composer.addPass(pass);
        this._hasPostProcessingPass = true;
    }
}
export { RenderSystem };
