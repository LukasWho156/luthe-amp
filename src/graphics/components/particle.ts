import * as THREE from 'three';
import { Sprite2D } from '../utility/sprite-2d.js';

class Particle {

    private _sprite;
    private _entity: any;
    private _dead = false;

    get sprite() {
        return this._sprite;
    }

    constructor(entity: any, sprite: Sprite2D) {
        this.revive(entity);
        this._sprite = sprite;
    }

    revive = (entity: any) => {
        this._dead = false;
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
    }

    checkDeath = () => {
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

    isDead = () => {
        return this._dead;
    }

    kill = () => {
        this._dead = true;
    }

    update = (delta: number) => {
        this._entity.velocity.add(this._entity.acceleration.clone().multiplyScalar(delta));
        this._entity.position.add(this._entity.velocity.clone().multiplyScalar(delta));
        this._entity.opacity -= (this._entity.fadeRate * delta);
        this._entity.size += (this._entity.growthRate * delta);
        this._entity.rotation += (this._entity.spin * delta);
        this._sprite.setRotation(this._entity.rotation);
        this._sprite.position.copy(this._entity.position);
        this._sprite.opacity = this._entity.opacity;
        this._sprite.setScale(this._entity.size);
        this._sprite.color.set(this._entity.color);
        this._sprite.blending = this._entity.blending;
        if(this.checkDeath()) {
            this.kill();
        }
    }

    dispose = () => {
        this._sprite.dispose();
    }

}

export { Particle };