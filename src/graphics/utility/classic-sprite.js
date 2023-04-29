import * as THREE from 'three'

class ClassicSprite {

    _xFrames;
    _yFrames;
    _image;
    _width;
    _height;
    _handle;
    _position;
    _scale;
    _rotation;
    _zPlaneChanged;
    _sx;
    _sy;
    _visible;

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
        return this._position.z
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
        this._image = config.texture;
        this._xFrames = config.framesX ?? 1;
        this._yFrames = config.framesY ?? 1;
        this._width = this._image.width / this._xFrames;
        this._height = this._image.height / this._yFrames;
        this._position = new THREE.Vector3(0, 0, 0);
        this._scale = new THREE.Vector2(config.scaleX ?? 1, config.scaleY ?? 1);
        this._handle = new THREE.Vector2(config.handleX ?? 0.5, config.handleY ?? 0.5);
        this._rotation = config.rotation ?? 0;
        this._visible = true;
        this.setPosition(config.x ?? 0, config.y ?? 0, config.z ?? 0);
        this.setFrame(0);
    }

    setFrame(i) {
        this._sx = this._width * (i % this._xFrames);
        this._sy = this._height * Math.floor(i / this._xFrames);
    }

    setPosition(x, y, z) {
        if(z && this._position.z !== z) this._zPlaneChanged = true;
        this._position.set(x, y, z ?? this._position.z);
    }

    render(ctxt) {
        if(!this._visible) return;
        const center = {
            x: this._position.x,
            y: this._position.y,
        }
        ctxt.translate(center.x, center.y);
        ctxt.rotate(this._rotation);
        const effectiveWidth = this._width * this._scale.x;
        const effectiveHeight = this._height * this._scale.y;
        ctxt.translate(-this._handle.x * effectiveWidth, -this._handle.y * effectiveHeight);
        ctxt.drawImage(this._image, this._sx, this._sy, this._width, this._height,
            0, 0, this._width * this._scale.x, this._height * this._scale.y);
        ctxt.translate(this._handle.x * effectiveWidth, this._handle.y * effectiveHeight);
        ctxt.rotate(-this._rotation);
        ctxt.translate(-center.x, -center.y)
    }

}

export { ClassicSprite };