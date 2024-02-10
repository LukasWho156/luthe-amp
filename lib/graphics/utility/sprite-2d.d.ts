import * as THREE from "three";
import { Handle, ISprite, SpriteConfiguration } from "./i-sprite.js";
import { PixelCollider } from "./pixel-collider.js";
declare class Sprite2D extends THREE.Sprite implements ISprite {
    private _xFrames;
    private _yFrames;
    private _width;
    private _height;
    private _scale;
    private _frame;
    repeat: THREE.Vector2;
    offset: THREE.Vector2;
    _rotation: number;
    opacity: number;
    color: THREE.Color;
    blending: 1;
    static invertYPosition: boolean;
    get width(): number;
    get height(): number;
    constructor(config: SpriteConfiguration);
    /**
     * make sure to update the sprite's material according to the sprite's frame,
     * rotation, opacity, color and blending mode.
     *
     * mostly used to make it possible for multiple sprites to share the same
     * texture or material.
     *
     * @override
     */
    onBeforeRender: () => void;
    setScale(scaleX: number, scaleY?: number): void;
    setPosition(x: number, y: number, z: number): void;
    pixelCollide(u: number, v: number, collider: PixelCollider): boolean;
    setFrame(i: number): void;
    setRotation(angle: number): void;
    setHandle(handle: Handle): void;
    private _setStringHandle;
    dispose(): void;
}
export { Sprite2D };
