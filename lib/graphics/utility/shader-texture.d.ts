import { SimpleComponent } from "../../index.js";
import { SpriteConfiguration } from "./i-sprite.js";
import { ExtendedShaderPass } from "../../post-processing/extended-shader-pass.js";
declare class ShaderTexture implements SimpleComponent {
    private _xFrames;
    private _yFrames;
    private _width;
    private _height;
    private _readBuffer;
    private _writeBuffer;
    private _target;
    private _passes;
    private _frame;
    private _pixelSize;
    private scene;
    private camera;
    private firstRender;
    get texture(): import("three").Texture;
    constructor(config: SpriteConfiguration);
    setFrame(i: number): void;
    addPass: (pass: ExtendedShaderPass) => void;
    update: (delta: number) => void;
}
export { ShaderTexture };
