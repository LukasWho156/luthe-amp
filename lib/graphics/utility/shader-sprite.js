import * as THREE from "three";
import { Game } from "../../index.js";
import SpriteShader from "../../post-processing/sprite-shader.js";
import { Sprite2D } from "./sprite-2d.js";
import { PixelCollider } from "./pixel-collider.js";
class ShaderSprite extends THREE.Group {
    constructor(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        super();
        this._frame = 0;
        this.sprite = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.ShaderMaterial(SpriteShader(config.options.shader.uniforms, config.options.shader.code)));
        this.add(this.sprite);
        const tex = (typeof config.texture === 'string') ? Game.getTexture(config.texture) : config.texture;
        if (!tex) {
            throw new Error("Texture doesn't exist");
        }
        const tex2d = tex.texture;
        if (((_a = config.options) === null || _a === void 0 ? void 0 : _a.collider) === 'pixel') {
            const collider = new PixelCollider(tex2d.image);
            this.sprite.userData.customCollider = (u, v) => this.pixelCollide(u, v, collider);
        }
        const shaderMat = this.sprite.material;
        shaderMat.transparent = true;
        shaderMat.uniforms.map.value = tex2d;
        this._xFrames = (_d = (_b = config.framesX) !== null && _b !== void 0 ? _b : (_c = tex.settings) === null || _c === void 0 ? void 0 : _c.framesX) !== null && _d !== void 0 ? _d : 1;
        this._yFrames = (_g = (_e = config.framesY) !== null && _e !== void 0 ? _e : (_f = tex.settings) === null || _f === void 0 ? void 0 : _f.framesY) !== null && _g !== void 0 ? _g : 1;
        this._width = tex2d.image.width / this._xFrames;
        this._height = tex2d.image.height / this._yFrames;
        this.setUniform('pixelSize', [1 / tex2d.image.width, 1 / tex2d.image.height]);
        this._scale = new THREE.Vector2(1, 1);
        this.setScale((_h = config.scaleX) !== null && _h !== void 0 ? _h : 1, (_j = config.scaleY) !== null && _j !== void 0 ? _j : 1);
        this.setHandle((_k = config.handle) !== null && _k !== void 0 ? _k : 'center');
        this.setRotation((_l = config.rotation) !== null && _l !== void 0 ? _l : 0);
        this.setPosition((_m = config.x) !== null && _m !== void 0 ? _m : 0, (_o = config.y) !== null && _o !== void 0 ? _o : 0, (_p = config.z) !== null && _p !== void 0 ? _p : 0);
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
        this._frame = i;
        const shaderMat = this.sprite.material;
        const x = Math.floor(i % this._xFrames);
        const y = this._yFrames - 1 - Math.floor(i / this._xFrames);
        const w = 1 / this._xFrames;
        const h = 1 / this._yFrames;
        shaderMat.uniforms.frame.value = [x * w, y * h, w, h];
    }
    setRotation(angle) {
        this.rotation.z = angle;
    }
    setHandle(handle) {
        if (typeof handle === 'string') {
            this._setStringHandle(handle);
            return;
        }
        this.sprite.position.set(0.5 - handle.x, 0.5 - handle.y, 0);
    }
    _setStringHandle(handle) {
        let x = 0;
        let y = 0;
        const coords = handle.split(' ');
        if (coords.find(e => e === 'left'))
            x = 0.5;
        if (coords.find(e => e === 'right'))
            x = -0.5;
        if (coords.find(e => e === 'top'))
            y = -0.5;
        if (coords.find(e => e === 'bottom'))
            y = 0.5;
        this.sprite.position.set(x, y, 0);
    }
    setUniform(key, value) {
        const shaderMat = this.sprite.material;
        shaderMat.uniforms[key] = { value: value };
    }
    dispose() {
        this.sprite.material.dispose();
        this.sprite.geometry.dispose();
    }
}
export { ShaderSprite };
