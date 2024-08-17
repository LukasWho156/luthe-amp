import * as THREE from "three";
import { Game } from "../../core/game.js";
import { PixelCollider } from "./pixel-collider.js";
class Sprite2D extends THREE.Sprite {
    _xFrames;
    _yFrames;
    _width;
    _height;
    _scale;
    _frame;
    repeat = new THREE.Vector2();
    offset = new THREE.Vector2();
    _rotation = 0;
    opacity = 1;
    color = new THREE.Color(0xffffff);
    blending = THREE.NormalBlending;
    static invertYPosition = false;
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    constructor(config) {
        super(config.material);
        this._frame = 0;
        const tex = (typeof config.texture === 'string') ? Game.getTexture(config.texture) : config.texture;
        if (!tex) {
            throw new Error("Texture doesn't exist");
        }
        const tex2d = tex.texture;
        this.material.map ??= tex2d;
        if (config.options?.collider === 'pixel') {
            const collider = new PixelCollider(tex2d.image);
            this.userData.customCollider = (u, v) => this.pixelCollide(u, v, collider);
        }
        this._xFrames = config.framesX ?? tex.settings?.framesX ?? 1;
        this._yFrames = config.framesY ?? tex.settings?.framesY ?? 1;
        this.repeat.set(1 / this._xFrames, 1 / this._yFrames);
        this._width = (config.width ?? tex2d.image.width) / this._xFrames;
        this._height = (config.height ?? tex2d.image.height) / this._yFrames;
        this._scale = new THREE.Vector2(1, 1);
        this.setScale(config.scaleX ?? 1, config.scaleY ?? 1);
        this.setHandle(config.handle ?? tex.settings?.handle ?? 'center');
        this.setRotation(config.rotation ?? 0);
        this.setPosition(config.x ?? 0, config.y ?? 0, config.z ?? 0);
        this.setFrame(0);
    }
    /**
     * make sure to update the sprite's material according to the sprite's frame,
     * rotation, opacity, color and blending mode.
     *
     * mostly used to make it possible for multiple sprites to share the same
     * texture or material.
     *
     * @override
     */
    onBeforeRender = () => {
        this.material.map?.repeat.copy(this.repeat);
        this.material.map?.offset.copy(this.offset);
        this.material.rotation = this._rotation;
        this.material.opacity = this.opacity;
        this.material.color.copy(this.color);
        this.material.blending = this.blending;
    };
    setScale(scaleX, scaleY) {
        scaleY ??= scaleX;
        this._scale.set(scaleX, scaleY);
        this.scale.set(this._scale.x * this._width, this._scale.y * this._height, 1);
    }
    setPosition(x, y, z) {
        this.position.x = x;
        this.position.y = (Sprite2D.invertYPosition ? -1 : 1) * y;
        this.position.z = z ?? this.position.z;
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
export { Sprite2D };
