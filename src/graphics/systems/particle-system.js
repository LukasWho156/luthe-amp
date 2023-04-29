import { Sprite2D } from '../utility/sprite-2d.js';
import { Particle } from '../components/particle.js';
import * as THREE from 'three';

class ParticleSystem {

    _particles;

    _scene;

    _texture;
    _framesX;
    _framesY;

    constructor(scene, texture, framesX, framesY) {
        this._particles = [];
        this._scene = scene;
        this._texture = texture;
        this._framesX = framesX;
        this._framesY = framesY;
    }

    spawn = (frame, entity) => {
        entity.position ??= new THREE.Vector3();
        entity.velocity ??= new THREE.Vector3();
        entity.acceleration ??= new THREE.Vector3();
        entity.opacity ??= 1;
        entity.fadeRate ??= 0;
        entity.size ??= 1;
        entity.growthRate ??= 0;
        entity.rotation ??= 0;
        entity.spin ??= 0;
        const sprite = new Sprite2D({
            texture: this._texture,
            framesX: this._framesX,
            framesY: this._framesY,
        });
        sprite.setFrame(frame);
        this._scene.add(sprite);
        const particle = new Particle(entity, sprite);
        particle.update(0);
        this._particles.push(particle);
    }

    update = (delta) => {
        this._particles.forEach(particle => {
            particle.update(delta);
            if(particle.isDead()) {
                this._scene.remove(particle.sprite);
                particle.kill();
            }
            
        });
        this._particles = this._particles.filter(particle => !particle.isDead());
    }

}

export { ParticleSystem };