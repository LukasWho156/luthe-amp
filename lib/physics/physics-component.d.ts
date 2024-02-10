declare class PhysicsComponent {
    _entity: any;
    _body: any;
    constructor(entity: any, body: any);
    update(): void;
}
export { PhysicsComponent };
