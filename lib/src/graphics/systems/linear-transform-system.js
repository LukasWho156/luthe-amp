class LinearTransformSystem {
    constructor(transform) {
        this._transform = transform;
        this._components = [];
    }
    add(component) {
        this._components.push(component);
    }
    update(delta, globalTime) {
        for (const component of this._components) {
            component.update(transform);
        }
    }
}
export default LinearTransformSystem;
