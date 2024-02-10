export default AnimationSystem;
declare class AnimationSystem {
    _components: any[];
    add(animation: any): void;
    update(delta: any, globalTime: any): void;
}
