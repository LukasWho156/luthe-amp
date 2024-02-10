import * as THREE from "three";
import { Handle, ISprite, SpriteConfiguration } from "./i-sprite.js";
import { PixelCollider } from "./pixel-collider.js";
declare class ShaderSprite extends THREE.Group implements ISprite {
    readonly sprite: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    private _xFrames;
    private _yFrames;
    private _width;
    private _height;
    private _scale;
    private _frame;
    constructor(config: SpriteConfiguration);
    setScale(scaleX: number, scaleY?: number): void;
    setPosition(x: number, y: number, z: number): void;
    pixelCollide(u: number, v: number, collider: PixelCollider): boolean;
    setFrame(i: number): void;
    setRotation(angle: number): void;
    setHandle(handle: Handle): void;
    private _setStringHandle;
    setUniform(key: string, value: any): void;
    dispose(): void;
}
export { ShaderSprite };
