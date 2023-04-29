import * as THREE from 'three';

class Particle {

    _sprite;
    _entity;

    get sprite() {
        return this._sprite;
    }

    constructor(entity, sprite) {
        this._entity = entity;
        this._entity.acceleration ??= new THREE.Vector3(0, 0, 0);
        this._entity.velocity ??= new THREE.Vector3(0, 0, 0);
        this._entity.position ??= new THREE.Vector3(0, 0, 0);
        this._entity.size ??= 1;
        this._entity.growthRate ??= 0;
        this._entity.opacity ??= 1;
        this._entity.fadeRate ??= 0;
        this._entity.rotation ??= 0;
        this._entity.spin ??= 0;
        this._entity.color ??= 0xffffff;
        this._entity.blending ??= THREE.NormalBlending;
        this._sprite = sprite;
    }

    isDead = () => {
        if(typeof this._entity.customDeath === 'function') {
            return this._entity.customDeath();
        }
        if(this._entity.size <= 0) {
            return true;
        }
        if(this._entity.opacity <= 0) {
            return true;
        }
        return false;
    }

    kill = () => {
        this._sprite.material?.map?.dispose();
        this._sprite.material?.dispose();
    }

    update = (delta) => {
        this._entity.velocity.add(this._entity.acceleration.clone().multiplyScalar(delta));
        this._entity.position.add(this._entity.velocity.clone().multiplyScalar(delta));
        this._entity.opacity -= (this._entity.fadeRate * delta);
        this._entity.size += (this._entity.growthRate * delta);
        this._entity.rotation += (this._entity.spin * delta);
        this._sprite.setRotation(this._entity.rotation);
        this._sprite.position.copy(this._entity.position);
        this._sprite.material.opacity = this._entity.opacity;
        this._sprite.setScale(this._entity.size);
        this._sprite.material.color.set(this._entity.color);
        this._sprite.material.blending = this._entity.blending;
    }

}

export { Particle };