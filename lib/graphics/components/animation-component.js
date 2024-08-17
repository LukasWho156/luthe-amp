class AnimationComponent {
    _entity;
    _sprite;
    _animations;
    _animationState;
    constructor(entity, sprite) {
        this._entity = entity;
        this._sprite = sprite;
        this._animations = new Map();
        this.defineAnimation('default', {
            frames: [0],
            loop: true,
            frameDuration: 1000,
        });
        this._animationState = {
            name: 'default',
            animation: this._animations.get('default'),
            currentFrame: 0,
            start: 0,
        };
    }
    defineAnimation(name, animation) {
        this._animations.set(name, animation);
    }
    _setAnimation(name, time) {
        if (name && this._animationState?.name === name)
            return;
        const animation = this._animations.get(name);
        if (!animation) {
            this._setAnimation('default', time);
            return;
        }
        this._animationState = {
            name: name,
            animation: animation,
            currentFrame: 0,
            start: time,
        };
        this._entity.animationState = name;
        this._sprite.setFrame(this._animationState.animation.frames[0]);
    }
    _progressAnimation(frame) {
        if (this._animationState.currentFrame !== frame) {
            this._animationState.currentFrame = frame;
            this._sprite.setFrame(this._animationState.animation.frames[frame]);
        }
    }
    update(delta, globalTime) {
        this._setAnimation(this._entity.animationState, globalTime);
        const animation = this._animationState.animation;
        const passed = (globalTime - (animation.useGlobalTimer ? 0 : this._animationState.start));
        let frame = Math.floor(passed / animation.frameDuration);
        if (frame >= animation.frames.length) {
            if (!animation.loop && animation.next) {
                this._setAnimation(animation.next, globalTime);
                return;
            }
            frame %= animation.frames.length;
        }
        this._progressAnimation(frame);
    }
}
export { AnimationComponent };
