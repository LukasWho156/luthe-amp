import { Sprite2D } from '../utility/sprite-2d.js';
declare class Particle {
    private _sprite;
    private _entity;
    private _dead;
    get sprite(): Sprite2D;
    constructor(entity: any, sprite: Sprite2D);
    revive: (entity: any) => void;
    checkDeath: () => any;
    isDead: () => boolean;
    kill: () => void;
    update: (delta: number) => void;
    dispose: () => void;
}
export { Particle };
