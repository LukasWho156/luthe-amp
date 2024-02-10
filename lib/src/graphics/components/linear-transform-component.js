class LinearTransformComponent {
    constructor(entity, sprite) {
        this._entity = entity;
        this._sprite = sprite;
    }
    update(transform) {
        const sX = transform[0][0] * this._entity.x + transform[0][1] * this._entity.y;
        const sY = transform[1][0] * this._entity.x + transform[1][1] * this._entity.y;
        this._sprite.setPosition(sX, sY);
        this._sprite.setRotation(-this._entity.angle);
    }
}
export default LinearTransformComponent;
