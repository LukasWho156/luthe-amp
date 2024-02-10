class AnimationSystem {
    constructor() {
        this._components = [];
    }
    add(animation) {
        this._components.push(animation);
    }
    update(delta, globalTime) {
        for (const component of this._components) {
            component.update(delta, globalTime);
        }
    }
}
export { AnimationSystem };
