import { Sprite2D } from '../utility/sprite-2d.js';
import { Particle } from '../components/particle.js';
import * as THREE from 'three';
class ParticleSystem {
    constructor(scene, texture, framesX, framesY, maxParticles) {
        this.spawn = (frame, entity) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            (_a = entity.position) !== null && _a !== void 0 ? _a : (entity.position = new THREE.Vector3());
            (_b = entity.velocity) !== null && _b !== void 0 ? _b : (entity.velocity = new THREE.Vector3());
            (_c = entity.acceleration) !== null && _c !== void 0 ? _c : (entity.acceleration = new THREE.Vector3());
            (_d = entity.opacity) !== null && _d !== void 0 ? _d : (entity.opacity = 1);
            (_e = entity.fadeRate) !== null && _e !== void 0 ? _e : (entity.fadeRate = 0);
            (_f = entity.size) !== null && _f !== void 0 ? _f : (entity.size = 1);
            (_g = entity.growthRate) !== null && _g !== void 0 ? _g : (entity.growthRate = 0);
            (_h = entity.rotation) !== null && _h !== void 0 ? _h : (entity.rotation = 0);
            (_j = entity.spin) !== null && _j !== void 0 ? _j : (entity.spin = 0);
            const existing = this._particles.find(p => p.isDead());
            if (existing) {
                existing.revive(entity);
                existing.update(0);
            }
            else if (this._poolSize < 0 || this._particles.length < this._poolSize) {
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
            else {
                return false;
            }
            return true;
        };
        this.update = (delta) => {
            this._particles.forEach(particle => {
                if (particle.isDead())
                    return;
                particle.update(delta);
            });
            this._particles = this._particles.filter(particle => !particle.isDead());
        };
        this.unmount = () => {
            this._particles.forEach(particle => particle.dispose());
            this._particles = [];
        };
        this._particles = [];
        this._scene = scene;
        this._texture = texture;
        this._framesX = framesX;
        this._framesY = framesY;
        this._poolSize = maxParticles !== null && maxParticles !== void 0 ? maxParticles : -1;
    }
}
export { ParticleSystem };
