import { SimpleComponent } from "../../interfaces/simple-component";
import { Sprite2D } from "../utility/sprite-2d";
declare class AnimationComponent implements SimpleComponent {
    private _entity;
    private _sprite;
    private _animations;
    private _animationState;
    constructor(entity: any, sprite: Sprite2D);
    defineAnimation(name: string, animation: AnimationDefinition): void;
    private _setAnimation;
    private _progressAnimation;
    update(delta: number, globalTime: number): void;
}
/**
 * A configuration object used to define an animation in @see AnimationComponent
 */
type AnimationDefinition = {
    /** An array that contains the frames of the animation in order */
    frames: number[];
    /** How long each frame should be displayed, in milliseconds */
    frameDuration: number;
    /** If set to true, the animation will auto-repeat when finished */
    loop?: boolean;
    /** If set, one the animation finishes, switch to this animation */
    next?: string;
    /**
     * If set to true, ignore when the animation started. Useful for
     * syncing multiple animations
     */
    useGlobalTimer?: boolean;
};
export { AnimationComponent, AnimationDefinition };
