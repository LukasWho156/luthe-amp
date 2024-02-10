export default Particle;
declare class Particle {
    constructor(entity: any, sprite: any);
    _sprite: any;
    _entity: any;
    get sprite(): any;
    isDead: () => any;
    kill: () => void;
    update: (delta: any) => void;
}
