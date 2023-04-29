class PhysicsComponent {

    _entity;
    _body;

    constructor(entity: any, body: any) {
        this._entity = entity;
        this._body = body;
    }

    update() {
        const pos = this._body.GetPosition();
        this._entity.x = pos.x;
        this._entity.y = pos.y;
        this._entity.angle = this._body.GetAngle();
    }

}

export { PhysicsComponent };