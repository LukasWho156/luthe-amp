import * as THREE from 'three';
class Particle {
    get sprite() {
        return this._sprite;
    }
    constructor(entity, sprite) {
        this._dead = false;
        this.revive = (entity) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
            this._dead = false;
            this._entity = entity;
            (_a = (_m = this._entity).acceleration) !== null && _a !== void 0 ? _a : (_m.acceleration = new THREE.Vector3(0, 0, 0));
            (_b = (_o = this._entity).velocity) !== null && _b !== void 0 ? _b : (_o.velocity = new THREE.Vector3(0, 0, 0));
            (_c = (_p = this._entity).position) !== null && _c !== void 0 ? _c : (_p.position = new THREE.Vector3(0, 0, 0));
            (_d = (_q = this._entity).size) !== null && _d !== void 0 ? _d : (_q.size = 1);
            (_e = (_r = this._entity).growthRate) !== null && _e !== void 0 ? _e : (_r.growthRate = 0);
            (_f = (_s = this._entity).opacity) !== null && _f !== void 0 ? _f : (_s.opacity = 1);
            (_g = (_t = this._entity).fadeRate) !== null && _g !== void 0 ? _g : (_t.fadeRate = 0);
            (_h = (_u = this._entity).rotation) !== null && _h !== void 0 ? _h : (_u.rotation = 0);
            (_j = (_v = this._entity).spin) !== null && _j !== void 0 ? _j : (_v.spin = 0);
            (_k = (_w = this._entity).color) !== null && _k !== void 0 ? _k : (_w.color = 0xffffff);
            (_l = (_x = this._entity).blending) !== null && _l !== void 0 ? _l : (_x.blending = THREE.NormalBlending);
        };
        this.checkDeath = () => {
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
        this.isDead = () => {
            return this._dead;
        };
        this.kill = () => {
            this._dead = true;
        };
        this.update = (delta) => {
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
            if (this.checkDeath()) {
                this.kill();
            }
        };
        this.dispose = () => {
            this._sprite.dispose();
        };
        this.revive(entity);
        this._sprite = sprite;
    }
}
export { Particle };
