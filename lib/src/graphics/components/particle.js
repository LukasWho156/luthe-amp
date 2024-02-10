class Particle {
    get sprite() {
        return this._sprite;
    }
    constructor(entity, sprite) {
        this.isDead = () => {
            if (typeof this._entity.customDeath === 'function') {
                return this._entity.customDeath();
            }
            if (this._entity.size <= 0) {
                return true;
            }
            if (this._entity.opacity <= 0) {
                return true;
            }
            return false;
        };
        this.kill = () => {
            this._sprite.material.texture.dispose();
            this._sprite.material.dispose();
        };
        this.update = (delta) => {
            this._entity.velocity.add(this._entity.acceleration * delta);
            this._entity.position.add(this._entity.velocity * delta);
            this._entity.opacity -= this._entity.fadeRate * delta;
            this._entity.size += this._entity.growthRate * delta;
            this._entity.rotation += this._entity.spin * delta;
            this._sprite.setRotation(this._entity.rotation);
            this._sprite.position.copy(this._entity.position);
            this._sprite.material.opacity = this._entity.opacity;
            this._sprite.setScale(this._entity.size);
        };
        this._entity = entity;
        this._sprite = sprite;
    }
}
export default Particle;
