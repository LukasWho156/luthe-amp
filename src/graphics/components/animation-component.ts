import { SimpleComponent } from "../../interfaces/simple-component.js";
import { Sprite2D } from "../utility/sprite-2d.js";

class AnimationComponent implements SimpleComponent {

    private _entity;
    private _sprite;

    private _animations;
    private _animationState: AnimationState;

    constructor(entity: any, sprite: Sprite2D) {
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
        }
    }

    defineAnimation(name: string, animation: AnimationDefinition) {
        this._animations.set(name, animation);
    }

    private _setAnimation(name: string, time: number) {
        if(name && this._animationState?.name === name) return;
        const animation = this._animations.get(name);
        if(!animation) {
            this._setAnimation('default', time);
            return;
        }
        this._animationState = {
            name: name,
            animation: animation,
            currentFrame: 0,
            start: time,
        }
        this._entity.animationState = name;
        this._sprite.setFrame(this._animationState.animation.frames[0]);
    }

    private _progressAnimation(frame: number) {
        if(this._animationState.currentFrame !== frame) {
            this._animationState.currentFrame = frame;
            this._sprite.setFrame(this._animationState.animation.frames[frame]);
        }
    }

    update(delta: number, globalTime: number) {
        this._setAnimation(this._entity.animationState, globalTime);
        const animation = this._animationState.animation;
        const passed = (globalTime - (animation.useGlobalTimer ? 0 : this._animationState.start));
        let frame = Math.floor(passed / animation.frameDuration);
        if(frame >= animation.frames.length) {
            if(!animation.loop && animation.next) {
                this._setAnimation(animation.next, globalTime);
                return;
            }
            frame %= animation.frames.length;
        }
        this._progressAnimation(frame);
    }

}

/**
 * A configuration object used to define an animation in @see AnimationComponent
 */
 type AnimationDefinition = {
    /** An array that contains the frames of the animation in order */
    frames: number[],
    /** How long each frame should be displayed, in milliseconds */
    frameDuration: number,
    /** If set to true, the animation will auto-repeat when finished */
    loop?: boolean,
    /** If set, one the animation finishes, switch to this animation */
    next?: string,
    /**
     * If set to true, ignore when the animation started. Useful for
     * syncing multiple animations
     */
    useGlobalTimer?: boolean,
}

/** Stores info about the current animation, used internally */
type AnimationState = {
    name: string,
    animation: AnimationDefinition,
    currentFrame: number,
    start: number,
}

export { AnimationComponent, AnimationDefinition };