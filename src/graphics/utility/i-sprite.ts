import { Texture2D } from "../../index.js";

interface ISprite {
    setScale(scaleX: number, scaleY?: number): void,
    setPosition(x: number, y: number, z: number): void,
    setRotation(angle: number): void,
    setFrame(i: number): void,
    setHandle(handle: Handle): void,
}

type Handle = THREE.Vector2 | string;

type SpriteConfiguration = {
    texture: Texture2D | string,
    width?: number,
    height?: number,
    framesX?: number,
    framesY?: number,
    scaleX?: number,
    scaleY?: number,
    handle?: Handle,
    rotation?: number,
    x?: number,
    y?: number,
    z?: number,
    options?: any;
}

export { ISprite, Handle, SpriteConfiguration };