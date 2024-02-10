import * as THREE from "three";
declare class Sprite2D extends THREE.Sprite {
    private _xFrames;
    private _yFrames;
    private _width;
    private _height;
    private _scale;
    static invertYPosition: boolean;
    get width(): number;
    get height(): number;
    constructor(config: SpriteConfiguration);
    setScale(scaleX: number, scaleY?: number): void;
    setPosition(x: number, y: number, z: number): void;
    setFrame(i: number): void;
    setRotation(angle: number): void;
    setHandle(handle: Handle): void;
    private _setStringHandle;
}
type Handle = THREE.Vector2 | string;
type SpriteConfiguration = {
    texture: THREE.Texture | string;
    framesX?: number;
    framesY?: number;
    scaleX?: number;
    scaleY?: number;
    handle?: Handle;
    rotation?: number;
    x?: number;
    y?: number;
    z?: number;
};
export { Sprite2D, SpriteConfiguration, Handle };
