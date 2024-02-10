import { Mesh, OrthographicCamera, PlaneGeometry, Scene, WebGLRenderTarget, WebGLRenderer } from "three";
import { Game } from "../../index.js";
import { ExtendedShaderPass } from "../../post-processing/extended-shader-pass.js";
import SpriteShader from "../../post-processing/sprite-shader.js";
let texRenderer;
class ShaderTexture {
    get texture() {
        return this._target.texture;
    }
    constructor(config) {
        var _a, _b, _c, _d, _e, _f;
        this.firstRender = true;
        this.addPass = (pass) => {
            pass.setUniform('pixelSize', this._pixelSize);
            this._passes.push(pass);
        };
        this.update = (delta) => {
            if (!texRenderer) {
                texRenderer = new WebGLRenderer();
            }
            texRenderer.setSize(this._width, this._height);
            //texRenderer.clear();
            //texRenderer.setRenderTarget(this._target);
            //texRenderer.render(this.scene, this.camera);
            //this._target.texture.needsUpdate = true;
            //console.log(this._target.texture.uuid);
            this._passes.forEach((pass, i) => {
                const isLastPass = (i === this._passes.length - 1);
                const renderTarget = isLastPass ? this._target : this._writeBuffer;
                pass.setUniform('frame', this._frame);
                pass.render(texRenderer, renderTarget, this._readBuffer, delta, false);
                this._target.texture.needsUpdate = true;
                [this._readBuffer, this._writeBuffer] = [this._writeBuffer, this._readBuffer];
            });
        };
        const tex = (typeof config.texture === 'string') ? Game.getTexture(config.texture) : config.texture;
        if (!tex) {
            throw new Error("Texture doesn't exist");
        }
        const tex2d = tex.texture;
        this._xFrames = (_c = (_a = config.framesX) !== null && _a !== void 0 ? _a : (_b = tex.settings) === null || _b === void 0 ? void 0 : _b.framesX) !== null && _c !== void 0 ? _c : 1;
        this._yFrames = (_f = (_d = config.framesY) !== null && _d !== void 0 ? _d : (_e = tex.settings) === null || _e === void 0 ? void 0 : _e.framesY) !== null && _f !== void 0 ? _f : 1;
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
        console.log(spritePass.uniforms);
        this.addPass(spritePass);
        this.scene = new Scene();
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
        this.camera.position.z = 5;
        this.scene.add(new Mesh(new PlaneGeometry()));
    }
    setFrame(i) {
        if (i < 0 || i > this._xFrames * this._yFrames)
            return;
        const x = Math.floor(i % this._xFrames);
        const y = this._yFrames - 1 - Math.floor(i / this._xFrames);
        const w = 1 / this._xFrames;
        const h = 1 / this._yFrames;
        this._frame = [x * w, y * h, w, h];
    }
}
export { ShaderTexture };
