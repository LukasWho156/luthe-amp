export class LinearTransformSystem {
    constructor(transform: any);
    _transform: any;
    _components: any[];
    add(component: any): void;
    update(delta: any, globalTime: any): void;
}
