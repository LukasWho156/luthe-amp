import { System } from "../interfaces/system.js";
import { PhysicsComponent } from "./physics-component.js";
import { Box2D as Box2DFactory } from "./Box2D.js";

let _b2: any;

const velIterations = 3;
const posIterations = 3;

function createPolygonShape(vertices: B2DCoord[]) {
    var shape = new _b2.b2PolygonShape();            
    var buffer = _b2._malloc(vertices.length * 8);
    var offset = 0;
    for (var i=0;i<vertices.length;i++) {
        _b2.HEAPF32[buffer + offset >> 2] = vertices[i].get_x();
        _b2.HEAPF32[buffer + (offset + 4) >> 2] = vertices[i].get_y();
        offset += 8;
    }            
    var ptr_wrapped = _b2.wrapPointer(buffer, _b2.b2Vec2);
    shape.Set(ptr_wrapped, vertices.length);
    return shape;
}

function createChainShape(vertices: B2DCoord[], closedLoop: boolean) {
    var shape = new _b2.b2ChainShape();            
    var buffer = _b2._malloc(vertices.length * 8);
    var offset = 0;
    for (var i=0;i<vertices.length;i++) {
        _b2.HEAPF32[buffer + offset >> 2] = vertices[i].get_x();
        _b2.HEAPF32[buffer + (offset + 4) >> 2] = vertices[i].get_y();
        offset += 8;
    }            
    var ptr_wrapped = _b2.wrapPointer(buffer, _b2.b2Vec2);
    if ( closedLoop )
        shape.CreateLoop(ptr_wrapped, vertices.length);
    else
        shape.CreateChain(ptr_wrapped, vertices.length);
    return shape;
}

type WorldConfig = {
    gravity?: number
}

type Coord = {
    x: number,
    y: number,
}

type B2DCoord = {
    get_x: () => number,
    get_y: () => number,
}

type BodyConfig = {
    type: string,
    position: THREE.Vector2 | THREE.Vector3,
    angle?: number,
    density?: number,
    shape: string,
    radius?: number,
    coords?: Coord[],
}

class PhysicsSystem extends EventTarget implements System {

    _world;
    _components: PhysicsComponent[];

    constructor(box2D: any, config: WorldConfig) {
        super();
        config = config ?? {};
        _b2 = box2D;
        this._world = new _b2.b2World(config.gravity ?? new _b2.b2Vec2(0, 10));
        this._components = [];
        const myListener = new box2D.JSContactListener();
        myListener.BeginContact = (no: any) => {
            const contact = box2D.wrapPointer(no, box2D.b2Contact);
            const a = contact.GetFixtureA()
            const b = contact.GetFixtureB()
            this.dispatchEvent(new CustomEvent('collisionstart', {detail: {fixtureA: a, fixtureB: b}}))
        }
        myListener.EndContact = (no: any) => {
            //noop
        }
        myListener.PreSolve = (no: any) => {
            //noop
        }
        myListener.PostSolve = (no: any) => {
            //noop
        }
        this._world.SetContactListener(myListener);
    }

    createBody(config: BodyConfig) {
        const bodyDef = new _b2.b2BodyDef();
        switch(config.type) {
            case 'dynamic':
                bodyDef.set_type(_b2.b2_dynamicBody);
                bodyDef.awake = true;
                break;
            case 'kinematic':
                bodyDef.set_type(_b2.b2_kinematicBody);
                break;
            default:
                bodyDef.set_type(_b2.b2_staticBody);
        }
        bodyDef.position = config.position ? new _b2.b2Vec2(config.position.x, config.position.y) : new _b2.b2Vec2(0, 0);
        bodyDef.angle = config.angle ?? 0;
        const body = this._world.CreateBody(bodyDef);
        let shape;
        switch(config.shape) {
            case 'circle':
                shape = new _b2.b2CircleShape();
                shape.m_radius = config.radius ?? 1;
                break;
            case 'polygon':
                if(!config.coords) {
                    throw new Error('impossible to create polygon shape without coords')
                }
                shape = this._createPolygon(config.coords);
                break;
            case 'chainloop':
                if(!config.coords) {
                    throw new Error('impossible to create chain loop shape without coords')
                }
                shape = this._createChainLoop(config.coords);
                break;
        }
        body.CreateFixture(shape, config.density ?? 1);
        return body;
    }

    add(component: PhysicsComponent) {
        this._components.push(component);
    }

    private _createPolygon(coords: Coord[]) {
        const shape = createPolygonShape(coords.map(c => new _b2.b2Vec2(c.x, c.y)));
        return shape;
    }

    private _createChainLoop(coords: Coord[]) {
        const shape = createChainShape(coords.map(c => new _b2.b2Vec2(c.x, c.y)), true);
        return shape;
    }

    update(delta: number, globalTime: number) {
        this._world.Step(delta / 1000, velIterations, posIterations);
        for(const component of this._components) {
            component.update();
        }
    }

    static async create(config: WorldConfig) {
        const box2D = await Box2DFactory();
        return new PhysicsSystem(box2D, config);
    }

}

export { PhysicsSystem };