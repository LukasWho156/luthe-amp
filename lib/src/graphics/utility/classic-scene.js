import * as THREE from 'three';
import Game from '../../core/game.js';
class ClassicScene {
    get texture() {
        return this._texture;
    }
    get image() {
        return Game.loadTexture(this._canvas.toDataURL()).then(tex => tex.image);
    }
    constructor(width, height) {
        this._canvas = document.createElement('canvas');
        this._canvas.setAttribute('width', width);
        this._canvas.setAttribute('height', height);
        this._context = this._canvas.getContext('2d');
        this._texture = new THREE.CanvasTexture(this._canvas);
        this._width = width;
        this._height = height;
        this._sprites = [];
    }
    add(sprite) {
        this._sprites.push(sprite);
        this.resort();
    }
    resort() {
        this._sprites.sort((a, b) => a.z - b.z);
    }
    update(delta, globalTime) {
        let needsUpdate = false;
        for (const sprite of this._sprites) {
            if (sprite.zPlaneChanged)
                needsUpdate = true;
        }
        if (needsUpdate)
            this.resort();
        for (const sprite of this._sprites) {
            sprite.render(this._context);
        }
        this._texture.needsUpdate = true;
    }
}
export default ClassicScene;
