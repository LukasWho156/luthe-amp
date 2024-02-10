export default ClassicScene;
declare class ClassicScene {
    constructor(width: any, height: any);
    _width: any;
    _height: any;
    _sprites: any[];
    _canvas: HTMLCanvasElement;
    _context: CanvasRenderingContext2D | null;
    _texture: THREE.CanvasTexture;
    get texture(): THREE.CanvasTexture;
    get image(): any;
    add(sprite: any): void;
    resort(): void;
    update(delta: any, globalTime: any): void;
}
import * as THREE from "three";
