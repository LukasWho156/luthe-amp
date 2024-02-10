import * as THREE from "three";
import { Game } from "../../core/game";
class Sprite2D extends THREE.Sprite {
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    constructor(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        super();
        const tex = (typeof config.texture === 'string') ? Game.getTexture(config.texture) : config.texture;
        if (!tex) {
            throw new Error("Texture doesn't exist");
        }
        this.material.map = tex === null || tex === void 0 ? void 0 : tex.clone();
        this._xFrames = (_a = config.framesX) !== null && _a !== void 0 ? _a : 1;
        this._yFrames = (_b = config.framesY) !== null && _b !== void 0 ? _b : 1;
        this.material.map.repeat.set(1 / this._xFrames, 1 / this._yFrames);
        this._width = tex.image.width / this._xFrames;
        this._height = tex.image.height / this._yFrames;
        this._scale = new THREE.Vector2(1, 1);
        this.setScale((_c = config.scaleX) !== null && _c !== void 0 ? _c : 1, (_d = config.scaleY) !== null && _d !== void 0 ? _d : 1);
        this.setHandle((_e = config.handle) !== null && _e !== void 0 ? _e : 'center');
        this.setRotation((_f = config.rotation) !== null && _f !== void 0 ? _f : 0);
        this.setPosition((_g = config.x) !== null && _g !== void 0 ? _g : 0, (_h = config.y) !== null && _h !== void 0 ? _h : 0, (_j = config.z) !== null && _j !== void 0 ? _j : 0);
        this.setFrame(0);
    }
    setScale(scaleX, scaleY) {
        scaleY !== null && scaleY !== void 0 ? scaleY : (scaleY = scaleX);
        this._scale.set(scaleX, scaleY);
        this.scale.set(this._scale.x * this._width, this._scale.y * this._height, 1);
    }
    setPosition(x, y, z) {
        this.position.x = x;
        this.position.y = (Sprite2D.invertYPosition ? -1 : 1) * y;
        this.position.z = z !== null && z !== void 0 ? z : this.position.z;
    }
    setFrame(i) {
        var _a;
        if (i < 0 || i > this._xFrames * this._yFrames)
            return;
        (_a = this.material.map) === null || _a === void 0 ? void 0 : _a.offset.set((1 / this._xFrames) * (i % this._xFrames), (1 / this._yFrames) * (this._yFrames - Math.floor(i / this._xFrames)));
    }
    setRotation(angle) {
        this.material.rotation = angle;
    }
    setHandle(handle) {
        if (typeof handle === 'string') {
            this._setStringHandle(handle);
            return;
        }
        this.center.copy(handle);
    }
    _setStringHandle(handle) {
        let x = 0.5;
        let y = 0.5;
        const coords = handle.split(' ');
        if (coords.find(e => e === 'left'))
            x = 0;
        if (coords.find(e => e === 'right'))
            x = 1;
        if (coords.find(e => e === 'top'))
            y = 1;
        if (coords.find(e => e === 'bottom'))
            y = 0;
        this.center.set(x, y);
    }
}
Sprite2D.invertYPosition = true;
export { Sprite2D };
