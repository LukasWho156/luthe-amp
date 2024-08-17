import { Box2D as Box2DFactory } from "./Box2D.js";
let _b2;
const velIterations = 3;
const posIterations = 3;
function createPolygonShape(vertices) {
    var shape = new _b2.b2PolygonShape();
    var buffer = _b2._malloc(vertices.length * 8);
    var offset = 0;
    for (var i = 0; i < vertices.length; i++) {
        _b2.HEAPF32[buffer + offset >> 2] = vertices[i].get_x();
        _b2.HEAPF32[buffer + (offset + 4) >> 2] = vertices[i].get_y();
        offset += 8;
    }
    var ptr_wrapped = _b2.wrapPointer(buffer, _b2.b2Vec2);
    shape.Set(ptr_wrapped, vertices.length);
    return shape;
}
function createChainShape(vertices, closedLoop) {
    var shape = new _b2.b2ChainShape();
    var buffer = _b2._malloc(vertices.length * 8);
    var offset = 0;
    for (var i = 0; i < vertices.length; i++) {
        _b2.HEAPF32[buffer + offset >> 2] = vertices[i].get_x();
        _b2.HEAPF32[buffer + (offset + 4) >> 2] = vertices[i].get_y();
        offset += 8;
    }
    var ptr_wrapped = _b2.wrapPointer(buffer, _b2.b2Vec2);
    if (closedLoop)
        shape.CreateLoop(ptr_wrapped, vertices.length);
    else
        shape.CreateChain(ptr_wrapped, vertices.length);
    return shape;
}
class PhysicsSystem extends EventTarget {
    _world;
    _components;
    constructor(box2D, config) {
        super();
        config = config ?? {};
        _b2 = box2D;
        this._world = new _b2.b2World(config.gravity ?? new _b2.b2Vec2(0, 10));
        this._components = [];
        const myListener = new box2D.JSContactListener();
        myListener.BeginContact = (no) => {
            const contact = box2D.wrapPointer(no, box2D.b2Contact);
            const a = contact.GetFixtureA();
            const b = contact.GetFixtureB();
            this.dispatchEvent(new CustomEvent('collisionstart', { detail: { fixtureA: a, fixtureB: b } }));
        };
        myListener.EndContact = (no) => {
            //noop
        };
        myListener.PreSolve = (no) => {
            //noop
        };
        myListener.PostSolve = (no) => {
            //noop
        };
        this._world.SetContactListener(myListener);
    }
    createBody(config) {
        const bodyDef = new _b2.b2BodyDef();
        switch (config.type) {
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
        switch (config.shape) {
            case 'circle':
                shape = new _b2.b2CircleShape();
                shape.m_radius = config.radius ?? 1;
                break;
            case 'polygon':
                if (!config.coords) {
                    throw new Error('impossible to create polygon shape without coords');
                }
                shape = this._createPolygon(config.coords);
                break;
            case 'chainloop':
                if (!config.coords) {
                    throw new Error('impossible to create chain loop shape without coords');
                }
                shape = this._createChainLoop(config.coords);
                break;
        }
        body.CreateFixture(shape, config.density ?? 1);
        return body;
    }
    add(component) {
        this._components.push(component);
    }
    _createPolygon(coords) {
        const shape = createPolygonShape(coords.map(c => new _b2.b2Vec2(c.x, c.y)));
        return shape;
    }
    _createChainLoop(coords) {
        const shape = createChainShape(coords.map(c => new _b2.b2Vec2(c.x, c.y)), true);
        return shape;
    }
    update(delta, globalTime) {
        this._world.Step(delta / 1000, velIterations, posIterations);
        for (const component of this._components) {
            component.update();
        }
    }
    static async create(config) {
        const box2D = await Box2DFactory();
        return new PhysicsSystem(box2D, config);
    }
}
export { PhysicsSystem };
