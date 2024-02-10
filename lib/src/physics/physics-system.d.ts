import { System } from "../interfaces/system.js";
import PhysicsComponent from "./physics-component.js";
type WorldConfig = {
    gravity?: number;
};
type Coord = {
    x: number;
    y: number;
};
type BodyConfig = {
    type: string;
    position: THREE.Vector2 | THREE.Vector3;
    angle?: number;
    density?: number;
    shape: string;
    radius?: number;
    coords?: Coord[];
};
declare class PhysicsSystem extends EventTarget implements System {
    _world: any;
    _components: PhysicsComponent[];
    constructor(box2D: any, config: WorldConfig);
    createBody(config: BodyConfig): any;
    add(component: PhysicsComponent): void;
    private _createPolygon;
    private _createChainLoop;
    update(delta: number, globalTime: number): void;
    static create(config: WorldConfig): Promise<PhysicsSystem>;
}
export default PhysicsSystem;
