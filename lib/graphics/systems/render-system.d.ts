import { Pass } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { THREE } from "../../index.js";
import { System } from "../../index.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
declare class RenderSystem implements System {
    private _composer;
    private _isFirstPass;
    private _hasPostProcessingPass;
    constructor();
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
    addRenderPass(scene: THREE.Scene, camera: THREE.Camera): RenderPass;
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
    addPostProcessingPass(pass: Pass): void;
    update: (delta: number) => void;
}
export { RenderSystem };
