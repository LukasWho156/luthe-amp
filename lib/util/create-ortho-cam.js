import { Game } from '../core/game.js';
import * as THREE from 'three';
/**
 * A convenience method to create an orthographic camera whose frustum fits
 * the Game's width and height. Used primarily for 2D scenes.
 *
 * @param topLeft If set to true, the top left corner of the screen will be
 * at 0, 0.
 * @returns A camera that goes from -Game.width / 2 to +Game.width / 2 in x-
 * direction, as well as from -Game.height / 2 to +Game.height / 2 in y-
 * direcion. In z-direction, the frustum goes from 0.1 to 1000, with the
 * camera having an initial z-position of 500.
 */
const createOrthoCam = (topLeft = false) => {
    const camera = new THREE.OrthographicCamera(-Game.width / 2, Game.width / 2, Game.height / 2, -Game.height / 2, 0.1, 1000);
    camera.position.z = 500;
    if (topLeft) {
        camera.position.x = Game.width / 2;
        camera.position.y = Game.height / 2;
    }
    return camera;
};
export { createOrthoCam };
