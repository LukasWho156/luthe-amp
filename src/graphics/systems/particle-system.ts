import { Sprite2D } from '../utility/sprite-2d.js';
import { Particle } from '../components/particle.js';
import * as THREE from 'three';
import { Texture2D } from '../../index.js';

class ParticleSystem {

    _particles: Particle[];

    _scene;

    _texture;
    _framesX;
    _framesY;

    _poolSize;

    constructor(scene: THREE.Object3D, texture: Texture2D, framesX: number, framesY: number, maxParticles?: number) {
        this._particles = [];
        this._scene = scene;
        this._texture = texture;
        this._framesX = framesX;
        this._framesY = framesY;
        this._poolSize = maxParticles ?? -1;
    }

    spawn = (frame: number, entity: any) => {
        entity.position ??= new THREE.Vector3();
        entity.velocity ??= new THREE.Vector3();
        entity.acceleration ??= new THREE.Vector3();
        entity.opacity ??= 1;
        entity.fadeRate ??= 0;
        entity.size ??= 1;
        entity.growthRate ??= 0;
        entity.rotation ??= 0;
        entity.spin ??= 0;
        const existing = this._particles.find(p => p.isDead());
        if(existing) {
            existing.revive(entity);
            existing.update(0);
        } else if(this._poolSize < 0 || this._particles.length < this._poolSize) {
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
        } else {
            return false;
        }
        return true;
    }

    update = (delta: number) => {
        this._particles.forEach(particle => {
            if(particle.isDead()) return;
            particle.update(delta);
        });
        this._particles = this._particles.filter(particle => !particle.isDead());
    }

    unmount = () => {
        this._particles.forEach(particle => particle.dispose());
        this._particles = [];
    }

}

export { ParticleSystem };