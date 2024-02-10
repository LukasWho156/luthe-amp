export class ClassicSprite {
    constructor(config: any);
    _xFrames: any;
    _yFrames: any;
    _image: any;
    _width: number;
    _height: number;
    _handle: THREE.Vector2;
    _position: THREE.Vector3;
    _scale: THREE.Vector2;
    _rotation: any;
    _zPlaneChanged: any;
    _sx: any;
    _sy: any;
    _visible: boolean;
    get zPlaneChanged(): any;
    get width(): number;
    get height(): number;
    get z(): number;
    set visible(arg: boolean);
    get visible(): boolean;
    set rotation(arg: any);
    get rotation(): any;
    set image(arg: any);
    get image(): any;
    setFrame(i: any): void;
    setPosition(x: any, y: any, z: any): void;
    render(ctxt: any): void;
}
import * as THREE from "three";