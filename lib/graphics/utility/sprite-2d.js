import * as THREE from "three";
import { Game } from "../../core/game.js";
import { PixelCollider } from "./pixel-collider.js";
class Sprite2D extends THREE.Sprite {
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    constructor(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        super();
        this.repeat = new THREE.Vector2();
        this.offset = new THREE.Vector2();
        this._rotation = 0;
        this.opacity = 1;
        this.color = new THREE.Color(0xffffff);
        this.blending = THREE.NormalBlending;
        this.onBeforeRender = () => {
            var _a, _b;
            (_a = this.material.map) === null || _a === void 0 ? void 0 : _a.repeat.copy(this.repeat);
            (_b = this.material.map) === null || _b === void 0 ? void 0 : _b.offset.copy(this.offset);
            this.material.rotation = this._rotation;
            this.material.opacity = this.opacity;
            this.material.color.copy(this.color);
            this.material.blending = this.blending;
        };
        this._frame = 0;
        const tex = (typeof config.texture === 'string') ? Game.getTexture(config.texture) : config.texture;
        if (!tex) {
            throw new Error("Texture doesn't exist");
        }
        const tex2d = tex.texture;
        if (((_a = config.options) === null || _a === void 0 ? void 0 : _a.collider) === 'pixel') {
            const collider = new PixelCollider(tex2d.image);
            this.userData.customCollider = (u, v) => this.pixelCollide(u, v, collider);
        }
        this.material.map = tex2d;
        this._xFrames = (_d = (_b = config.framesX) !== null && _b !== void 0 ? _b : (_c = tex.settings) === null || _c === void 0 ? void 0 : _c.framesX) !== null && _d !== void 0 ? _d : 1;
        this._yFrames = (_g = (_e = config.framesY) !== null && _e !== void 0 ? _e : (_f = tex.settings) === null || _f === void 0 ? void 0 : _f.framesY) !== null && _g !== void 0 ? _g : 1;
        this.repeat.set(1 / this._xFrames, 1 / this._yFrames);
        this._width = ((_h = config.width) !== null && _h !== void 0 ? _h : tex2d.image.width) / this._xFrames;
        this._height = ((_j = config.height) !== null && _j !== void 0 ? _j : tex2d.image.height) / this._yFrames;
        this._scale = new THREE.Vector2(1, 1);
        this.setScale((_k = config.scaleX) !== null && _k !== void 0 ? _k : 1, (_l = config.scaleY) !== null && _l !== void 0 ? _l : 1);
        this.setHandle((_p = (_m = config.handle) !== null && _m !== void 0 ? _m : (_o = tex.settings) === null || _o === void 0 ? void 0 : _o.handle) !== null && _p !== void 0 ? _p : 'center');
        this.setRotation((_q = config.rotation) !== null && _q !== void 0 ? _q : 0);
        this.setPosition((_r = config.x) !== null && _r !== void 0 ? _r : 0, (_s = config.y) !== null && _s !== void 0 ? _s : 0, (_t = config.z) !== null && _t !== void 0 ? _t : 0);
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
    pixelCollide(u, v, collider) {
        const x = Math.floor(this._frame % this._xFrames);
        const y = this._yFrames - 1 - Math.floor(this._frame / this._xFrames);
        const w = 1 / this._xFrames;
        const h = 1 / this._yFrames;
        const relU = (x + u) * w;
        const relV = (y + v) * h;
        return collider.collisionAt(relU, relV);
    }
    setFrame(i) {
        if (i < 0 || i > this._xFrames * this._yFrames)
            return;
        this._frame = i;
        this.offset.set((1 / this._xFrames) * (i % this._xFrames), (1 / this._yFrames) * (this._yFrames - Math.floor(i / this._xFrames) - 1));
    }
    setRotation(angle) {
        this._rotation = angle;
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
    dispose() {
        this.material.dispose();
        this.geometry.dispose();
    }
}
Sprite2D.invertYPosition = false;
export { Sprite2D };
