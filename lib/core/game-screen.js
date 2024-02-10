import { Game } from './game.js';
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
    /**
     * Create a basic screen. This method sets up the screen's system and pass lists.
     */
    constructor() {
        this._systems = [];
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
    addSystem(system, priority = 100) {
        this._systems.push({ system: system, priority: priority });
        this._systems.sort((a, b) => a.priority - b.priority);
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
    addListener(event, callback) {
        this.addSystem({
            mount: () => {
                setTimeout(() => Game.renderer.domElement.addEventListener(event, callback));
            },
            unmount: () => {
                Game.renderer.domElement.removeEventListener(event, callback);
            }
        });
    }
    /**
     * Called by the @see Game object every frame when this screen is the active
     * screen. Should not be called manually.
     *
     * @param delta The time since the last update in milliseconds
     * @param globalTime The total time since game start in milliseconds
     */
    update(delta, globalTime) {
        for (const system of this._systems) {
            if (typeof system.system.update === 'function') {
                system.system.update(delta, globalTime);
            }
        }
    }
    /**
     * Called by the @see Game object when this screen mounts. Should not be
     * called manually.
     */
    mount() {
        for (const system of this._systems) {
            if (typeof system.system.mount === 'function') {
                system.system.mount();
            }
        }
    }
    /**
     * Called by the @see Game object when this screen unmounts. Should not be
     * called manually.
     */
    unmount() {
        for (const system of this._systems) {
            if (typeof system.system.unmount === 'function') {
                system.system.unmount();
            }
        }
    }
}
export { GameScreen };
