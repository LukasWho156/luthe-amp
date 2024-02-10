import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { System } from '../interfaces/system.js';
/**
 * This class represents one screen of your game. It consists of two main ingredients:
 *
 * - A list of render- and postprocessing passes
 * - A list of systems.
 *
 * Render passes are used to render scenes to the screen. Postprocessing passes apply
 * shaders after rendering. More information about these can be found at the THREE.js
 * documentation.
 *
 * Systems consist of three methods: A mount(), an unmount() and an update() method.
 * When the screen becomes the active screen, the mount() method is called. This method
 * can be used to set up scenes, event listeners etc. While the screen is the active
 * screen, each frame the update() method is called, being passed a delta and a globalTime
 * variable. When a different screen becomes the new active screen, the unmount()
 * method is called.
 */
declare class GameScreen {
    private _systems;
    private _composer;
    private _isFirstPass;
    /**
     * Create a basic screen. This method sets up the screen's system and pass lists.
     */
    constructor();
    /**
     * Add a system to the game. This method should be used whenever you want to modify
     * the logic of the screen.
     *
     * The added system can either be a predefined system or a custom system. See @see System
     * for more information about how to make your own system.
     *
     * Note that systems are run in the order they're added to the screen.
     *
     * @param system
     */
    addSystem(system: System): void;
    /**
     * Convenience method that automatically adds and removes an event listener to the Game
     * canvas when the screen mounts or unmounts. Under the hood, this works by adding a
     * system.
     *
     * Note that oftentimes, the better choice might be to use predefined input systems.
     *
     * @param event The event type, e.g. 'click', 'keydown', ...
     * @param callback The callback function that is called when the event fires
     * @param callback.event The fired event
     */
    addListener(event: string, callback: (event: Event) => void): void;
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
    /**
     * Called by the @see Game object every frame when this screen is the active
     * screen. Should not be called manually.
     *
     * @param delta The time since the last update in milliseconds
     * @param globalTime The total time since game start in milliseconds
     */
    update(delta: number, globalTime: number): void;
    /**
     * Called by the @see Game object when this screen mounts. Should not be
     * called manually.
     */
    mount(): void;
    /**
     * Called by the @see Game object when this screen unmounts. Should not be
     * called manually.
     */
    unmount(): void;
}
export { GameScreen };
