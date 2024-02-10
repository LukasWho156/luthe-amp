import * as THREE from "three";
import { Game, Texture2D } from "../../core/game.js";
import { Handle, ISprite, SpriteConfiguration } from "./i-sprite.js";
import { PixelCollider } from "./pixel-collider.js";

class Sprite2D extends THREE.Sprite implements ISprite {

    private _xFrames;
    private _yFrames;
    private _width;
    private _height;
    private _scale;
    private _frame;

    public repeat: THREE.Vector2 = new THREE.Vector2();
    public offset: THREE.Vector2 = new THREE.Vector2();
    public _rotation: number = 0;
    public opacity = 1;
    public color = new THREE.Color(0xffffff);
    public blending = THREE.NormalBlending;

    public static invertYPosition: boolean = false;

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    constructor(config: SpriteConfiguration) {
        super(config.material);
        this._frame = 0;
        const tex = (typeof config.texture === 'string') ? Game.getTexture(config.texture) : config.texture;
        if(!tex) {
            throw new Error("Texture doesn't exist");
        }
        const tex2d = tex.texture;
        this.material.map ??= tex2d;
        if(config.options?.collider === 'pixel') {
            const collider = new PixelCollider(tex2d.image);
            this.userData.customCollider = (u: number, v: number) => this.pixelCollide(u, v, collider);
        }
        this._xFrames = config.framesX ?? tex.settings?.framesX ?? 1;
        this._yFrames = config.framesY ?? tex.settings?.framesY ?? 1;
        this.repeat.set(1 / this._xFrames, 1 / this._yFrames);
        this._width = (config.width ?? tex2d.image.width) / this._xFrames;
        this._height = (config.height ?? tex2d.image.height) / this._yFrames;
        this._scale = new THREE.Vector2(1, 1);
        this.setScale(config.scaleX ?? 1, config.scaleY ?? 1);
        this.setHandle(config.handle ?? tex.settings?.handle ?? 'center');
        this.setRotation(config.rotation ?? 0)
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
    }

    setScale(scaleX: number, scaleY?: number) {
        scaleY ??= scaleX;
        this._scale.set(scaleX, scaleY);
        this.scale.set(this._scale.x * this._width, this._scale.y * this._height, 1);
    }

    setPosition(x: number, y: number, z: number) {
        this.position.x = x;
        this.position.y = (Sprite2D.invertYPosition ? -1 : 1) * y;
        this.position.z = z ?? this.position.z;
    }

    pixelCollide(u: number, v: number, collider: PixelCollider) {
        const x = Math.floor(this._frame % this._xFrames);
        const y = this._yFrames - 1 - Math.floor(this._frame / this._xFrames);
        const w = 1 / this._xFrames;
        const h = 1 / this._yFrames;
        const relU = (x + u) * w;
        const relV = (y + v) * h;
        return collider.collisionAt(relU, relV);
    }

    setFrame(i: number) {
        if(i < 0 || i > this._xFrames * this._yFrames) return;
        this._frame = i;
        this.offset.set((1 / this._xFrames) * (i % this._xFrames),
            (1 / this._yFrames) * (this._yFrames - Math.floor(i / this._xFrames) - 1));
    }

    setRotation(angle: number) {
        this._rotation = angle;
    }

    setHandle(handle: Handle) {
        if(typeof handle === 'string') {
            this._setStringHandle(handle);
            return;
        }
        this.center.copy(handle);
    }

    private _setStringHandle(handle: string) {
        let x = 0.5;
        let y = 0.5;
        const coords = handle.split(' ');
        if(coords.find(e => e === 'left')) x = 0;
        if(coords.find(e => e === 'right')) x = 1;
        if(coords.find(e => e === 'top')) y = 1;
        if(coords.find(e => e === 'bottom')) y = 0;
        this.center.set(x, y);
    }

    dispose() {
        this.material.dispose();
        this.geometry.dispose();
    }

}

export { Sprite2D };