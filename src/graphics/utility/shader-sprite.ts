import * as THREE from "three";
import { Game } from "../../index.js";
import { Handle, ISprite, SpriteConfiguration } from "./i-sprite.js";
import SpriteShader from "../../post-processing/sprite-shader.js";
import { ShaderTexture } from "./shader-texture.js";
import { Sprite2D } from "./sprite-2d.js";

class ShaderSprite extends Sprite2D implements ISprite {

    private _shaderTex;

    get texture() {
        return this._shaderTex;
    }

    constructor(config: SpriteConfiguration) {
        super(config);
        this._shaderTex = new ShaderTexture(config);
        this.material = new THREE.SpriteMaterial({map: this._shaderTex.texture});
        this.setFrame(0);
    }

    setFrame(i: number) {
        this._shaderTex?.setFrame(i);
    }

}

export { ShaderSprite }