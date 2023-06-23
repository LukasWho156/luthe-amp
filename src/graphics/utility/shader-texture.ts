import { HalfFloatType, Mesh, OrthographicCamera, PlaneGeometry, Scene, WebGLRenderTarget, WebGLRenderer } from "three";
import { Game, SimpleComponent, Texture2D } from "../../index.js";
import { SpriteConfiguration } from "./i-sprite.js";
import { Pass } from "three/examples/jsm/postprocessing/Pass.js";
import { ExtendedShaderPass } from "../../post-processing/extended-shader-pass.js";
import SpriteShader from "../../post-processing/sprite-shader.js";

let texRenderer: WebGLRenderer | null;

class ShaderTexture implements SimpleComponent {

    private _xFrames: number;
    private _yFrames: number;
    private _width: number;
    private _height: number;

    private _readBuffer: WebGLRenderTarget;
    private _writeBuffer: WebGLRenderTarget;
    private _target: WebGLRenderTarget;

    private _passes: ExtendedShaderPass[];
    private _frame: number[];
    private _pixelSize: number[];

    private firstRender = true;

    get texture() {
        return this._target.texture;
    }

    constructor(config: SpriteConfiguration) {
        const tex = (typeof config.texture === 'string') ? Game.getTexture(config.texture) : config.texture;
        if(!tex) {
            throw new Error("Texture doesn't exist");
        }
        const tex2d = tex.texture;
        this._xFrames = config.framesX ?? tex.settings?.framesX ?? 1;
        this._yFrames = config.framesY ?? tex.settings?.framesY ?? 1;
        this._pixelSize = [1 / tex2d.image.width, 1 / tex2d.image.height];
        this._width = tex2d.image.width / this._xFrames;
        this._height = tex2d.image.height / this._yFrames;
        this._readBuffer = new WebGLRenderTarget(this._width, this._height);
        this._writeBuffer = new WebGLRenderTarget(this._width, this._height);
        this._target = new WebGLRenderTarget(this._width, this._height);
        this._target.depthBuffer = false;
        this._passes = [];
        this._frame = [0, 0, 1 / this._xFrames, 1 / this._yFrames];
        this.setFrame(0);
        const spritePass = new ExtendedShaderPass(SpriteShader);
        spritePass.setUniform('map', tex2d);
        this.addPass(spritePass);
    }

    setFrame(i: number) {
        if(i < 0 || i > this._xFrames * this._yFrames) return;
        const x = Math.floor(i % this._xFrames);
        const y = this._yFrames - 1 - Math.floor(i / this._xFrames);
        const w = 1 / this._xFrames;
        const h = 1 / this._yFrames;
        this._frame = [x * w, y * h, w, h];
    }

    addPass = (pass: ExtendedShaderPass) => {
        pass.setUniform('pixelSize', this._pixelSize);
        this._passes.push(pass);
    }

    update = (delta: number) => {
        if(!texRenderer) {
            texRenderer = new WebGLRenderer();
        }
        texRenderer.setSize(this._width, this._height);
        this._passes.forEach((pass, i) => {
            const isLastPass = (i === this._passes.length - 1);
            const renderTarget = isLastPass ? this._target : this._writeBuffer;
            pass.setUniform('frame', this._frame);
            pass.render(texRenderer!, renderTarget, this._readBuffer, delta, false);
            this._target.texture.needsUpdate = true;
            [this._readBuffer, this._writeBuffer] = [this._writeBuffer, this._readBuffer];
        });
    }

}

export { ShaderTexture };