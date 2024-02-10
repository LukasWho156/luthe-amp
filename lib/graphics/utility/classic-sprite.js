import * as THREE from 'three';
class ClassicSprite {
    get zPlaneChanged() {
        const temp = this._zPlaneChanged;
        this._zPlaneChanged = false;
        return temp;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get z() {
        return this._position.z;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(value) {
        this._rotation = value;
    }
    get image() {
        return this._image;
    }
    set image(value) {
        this._image = value;
    }
    constructor(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this._image = config.texture;
        this._xFrames = (_a = config.framesX) !== null && _a !== void 0 ? _a : 1;
        this._yFrames = (_b = config.framesY) !== null && _b !== void 0 ? _b : 1;
        this._width = this._image.width / this._xFrames;
        this._height = this._image.height / this._yFrames;
        this._position = new THREE.Vector3(0, 0, 0);
        this._scale = new THREE.Vector2((_c = config.scaleX) !== null && _c !== void 0 ? _c : 1, (_d = config.scaleY) !== null && _d !== void 0 ? _d : 1);
        this._handle = new THREE.Vector2((_e = config.handleX) !== null && _e !== void 0 ? _e : 0.5, (_f = config.handleY) !== null && _f !== void 0 ? _f : 0.5);
        this._rotation = (_g = config.rotation) !== null && _g !== void 0 ? _g : 0;
        this._visible = true;
        this.setPosition((_h = config.x) !== null && _h !== void 0 ? _h : 0, (_j = config.y) !== null && _j !== void 0 ? _j : 0, (_k = config.z) !== null && _k !== void 0 ? _k : 0);
        this.setFrame(0);
    }
    setFrame(i) {
        this._sx = this._width * (i % this._xFrames);
        this._sy = this._height * Math.floor(i / this._xFrames);
    }
    setPosition(x, y, z) {
        if (z && this._position.z !== z)
            this._zPlaneChanged = true;
        this._position.set(x, y, z !== null && z !== void 0 ? z : this._position.z);
    }
    render(ctxt) {
        if (!this._visible)
            return;
        const center = {
            x: this._position.x,
            y: this._position.y,
        };
        ctxt.translate(center.x, center.y);
        ctxt.rotate(this._rotation);
        const effectiveWidth = this._width * this._scale.x;
        const effectiveHeight = this._height * this._scale.y;
        ctxt.translate(-this._handle.x * effectiveWidth, -this._handle.y * effectiveHeight);
        ctxt.drawImage(this._image, this._sx, this._sy, this._width, this._height, 0, 0, this._width * this._scale.x, this._height * this._scale.y);
        ctxt.translate(this._handle.x * effectiveWidth, this._handle.y * effectiveHeight);
        ctxt.rotate(-this._rotation);
        ctxt.translate(-center.x, -center.y);
    }
}
export { ClassicSprite };
