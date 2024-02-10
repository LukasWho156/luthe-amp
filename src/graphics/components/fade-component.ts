import { Sprite2D } from "../utility/sprite-2d.js";

class FadeComponent {

    _sprite;
    _entity;

    _totalTime;
    _timer;
    _fromOpacity = 0;
    _toOpacity = 0;

    constructor(sprite: Sprite2D, entity: any) {
        this._timer = 0;
        this._totalTime = 0;
        this._sprite = sprite;
        this._entity = entity;
    }

    _activate() {
        this._timer = this._entity.fadeTimer;
        this._totalTime = this._entity.fadeTimer;
        this._fromOpacity = this._sprite.opacity;
        this._toOpacity = this._entity.fadeTarget;
        this._entity.fadeInited = false;
        this._sprite.layers.enable(0);
    }

    _skip() {
        this._entity.fadeSkipped = false;
        this.update(this._timer);
    }

    update(delta: number) {
        if(this._entity.fadeTarget != this._toOpacity) {
            this._activate();
        }
        if(this._entity.fadeSkipped) {
            this._skip();
        }
        if(this._timer <= 0) return;
        delta = (delta < this._timer) ? delta : this._timer;
        this._timer -= delta;
        this._sprite.opacity = this._fromOpacity + (this._toOpacity - this._fromOpacity) *  (1 - this._timer / this._totalTime);
    }

}

export { FadeComponent };