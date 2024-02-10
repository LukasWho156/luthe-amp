import { Particle } from '../components/particle.js';
import * as THREE from 'three';
import { Texture2D } from '../../index.js';
declare class ParticleSystem {
    _particles: Particle[];
    _scene: THREE.Object3D<THREE.Event>;
    _texture: Texture2D;
    _framesX: number;
    _framesY: number;
    _poolSize: number;
    constructor(scene: THREE.Object3D, texture: Texture2D, framesX: number, framesY: number, maxParticles?: number);
    spawn: (frame: number, entity: any) => boolean;
    update: (delta: number) => void;
    unmount: () => void;
}
export { ParticleSystem };
