import * as THREE from "three";
import { Game } from "../../index.js";
import { Handle, ISprite, SpriteConfiguration } from "./i-sprite.js";
import SpriteShader from "../../post-processing/sprite-shader.js";
import { Sprite2D } from "./sprite-2d.js";

class ShaderSprite extends THREE.Group implements ISprite {

    private _sprite;

    private _xFrames;
    private _yFrames;
    private _width;
    private _height;
    private _scale;

    constructor(config: SpriteConfiguration) {
        super();
        this._sprite = new THREE.Mesh(
            new THREE.PlaneGeometry(),
            new THREE.ShaderMaterial(SpriteShader(config.options.shader.uniforms, config.options.shader.code))
        );
        this.add(this._sprite);
        const tex = (typeof config.texture === 'string') ? Game.getTexture(config.texture) : config.texture;
        if(!tex) {
            throw new Error("Texture doesn't exist");
        }
        const tex2d = tex.texture;
        const shaderMat = this._sprite.material as THREE.ShaderMaterial;
        shaderMat.uniforms.map.value = tex2d;
        this._xFrames = config.framesX ?? tex.settings?.framesX ?? 1;
        this._yFrames = config.framesY ?? tex.settings?.framesY ?? 1;
        this._width = tex2d.image.width / this._xFrames;
        this._height = tex2d.image.height / this._yFrames;
        this.setUniform('pixelSize', [1 / tex2d.image.width, 1 / tex2d.image.height]);
        this._scale = new THREE.Vector2(1, 1);
        this.setScale(config.scaleX ?? 1, config.scaleY ?? 1);
        this.setHandle(config.handle ?? 'center');
        this.setRotation(config.rotation ?? 0)
        this.setPosition(config.x ?? 0, config.y ?? 0, config.z ?? 0);
        this.setFrame(0);
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

    setFrame(i: number) {
        const shaderMat = this._sprite.material as THREE.ShaderMaterial;
        const x = Math.floor(i % this._xFrames);
        const y = this._yFrames - 1 - Math.floor(i / this._xFrames);
        const w = 1 / this._xFrames;
        const h = 1 / this._yFrames;
        shaderMat.uniforms.frame.value = [x * w, y * h, w, h];
    }

    setRotation(angle: number) {
        this.rotation.z = angle;
    }

    setHandle(handle: Handle) {
        if(typeof handle === 'string') {
            this._setStringHandle(handle);
            return;
        }
        this._sprite.position.set(handle.x - 0.5, handle.y - 0.5, 0);
    }

    private _setStringHandle(handle: string) {
        let x = 0;
        let y = 0;
        const coords = handle.split(' ');
        if(coords.find(e => e === 'left')) x = -0.5;
        if(coords.find(e => e === 'right')) x = 0.5;
        if(coords.find(e => e === 'top')) y = 0.5;
        if(coords.find(e => e === 'bottom')) y = -0.5;
        this._sprite.position.set(x, y, 0);
    }

    setUniform(key: string, value: any) {
        const shaderMat = this._sprite.material as THREE.ShaderMaterial;
        shaderMat.uniforms[key] = { value: value };
    }

    dispose() {
        this._sprite.material.dispose();
        this._sprite.geometry.dispose();
    }

}

export { ShaderSprite }