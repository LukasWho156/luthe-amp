import { Game } from './game.js';
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { System } from '../interfaces/system.js';
import { ExtendedShaderPass } from '../post-processing/extended-shader-pass.js';
import { NoopShader } from '../post-processing/noop-shader.js';

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
class GameScreen {

    private _systems: System[];
    private _composer: EffectComposer;
    private _isFirstPass: boolean;
    private _hasPostProcessingPass: boolean;

    /**
     * Create a basic screen. This method sets up the screen's system and pass lists.
     */
    constructor() {
        this._systems = [];
        this._composer = new EffectComposer(Game.renderer);
        this._isFirstPass = true;
        this._hasPostProcessingPass = false;
    }

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
    addSystem(system: System) {
        this._systems.push(system);
    }

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
    addListener(event: string, callback: (event: Event) => void) {
        this._systems.push({
            mount: () => {
                setTimeout(() => Game.renderer.domElement.addEventListener(event, callback));
            },
            unmount: () => {
                Game.renderer.domElement.removeEventListener(event, callback);
            }
        })
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
    addRenderPass(scene: THREE.Scene, camera: THREE.Camera) {
        const pass = new RenderPass(scene, camera);
        if(this._isFirstPass) {
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
    addPostProcessingPass(pass: Pass) {
        this._composer.addPass(pass);
        this._hasPostProcessingPass = true;
    }

    /**
     * Called by the @see Game object every frame when this screen is the active
     * screen. Should not be called manually.
     * 
     * @param delta The time since the last update in milliseconds
     * @param globalTime The total time since game start in milliseconds
     */
    update(delta: number, globalTime: number) {
        for(const system of this._systems) {
            if(typeof system.update === 'function') {
                system.update(delta, globalTime);
            }
        }
        // ugly hack, but for some reason, having multiple render passes without
        // any post-processing doesn't seem to work.
        if(!this._hasPostProcessingPass) {
            this.addPostProcessingPass(new ExtendedShaderPass(NoopShader));
        }
        Game.renderer.clear();
        this._composer.render(delta);
    }

    /**
     * Called by the @see Game object when this screen mounts. Should not be
     * called manually.
     */
    mount() {
        for(const system of this._systems) {
            if(typeof system.mount === 'function') {
                system.mount();
            }
        }
    }

    /**
     * Called by the @see Game object when this screen unmounts. Should not be
     * called manually.
     */
    unmount() {
        for(const system of this._systems) {
            if(typeof system.unmount === 'function') {
                system.unmount();
            }
        }
    }

}

export { GameScreen };