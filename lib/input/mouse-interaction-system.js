import * as THREE from 'three';
import { Game } from '../core/game.js';
class MouseInteractionSystem {
    get active() {
        return this._active;
    }
    set active(value) {
        for (const component of this._components) {
            component.unhovered();
        }
        this._active = value;
    }
    get mouseHeld() {
        return this._mouseHeld;
    }
    constructor(width, height, camera, domElement) {
        this.add = (component) => {
            this._components.push(component);
            this._object3ds.push(component.object3d);
        };
        this._getIntersections = (event) => {
            this._raycaster.layers = this._camera.layers;
            this._pointer.x = (event.offsetX / this._width) * 2 - 1;
            this._pointer.y = -(event.offsetY / this._height) * 2 + 1;
            this._raycaster.setFromCamera(this._pointer, this._camera);
            const intersections = this._raycaster.intersectObjects(this._object3ds, false).filter(inter => {
                var _a, _b;
                if (typeof (inter.object.userData.customCollider) !== 'function') {
                    return true;
                }
                return inter.object.userData.customCollider((_a = inter.uv) === null || _a === void 0 ? void 0 : _a.x, (_b = inter.uv) === null || _b === void 0 ? void 0 : _b.y);
            });
            return intersections;
        };
        this._onMouseMoved = (event) => {
            var _a, _b;
            if (!this._active)
                return;
            Game.renderer.domElement.style.cursor = 'default';
            const intersections = this._getIntersections(event);
            if (this._mouseHeld) {
                if (this._draggedObject) {
                    const intersection = intersections.find(i => { var _a; return i.object === ((_a = this._draggedObject) === null || _a === void 0 ? void 0 : _a.object3d); });
                    this._draggedObject.dragged(event, intersection);
                }
                return;
            }
            for (const component of this._components) {
                if (((_a = intersections[0]) === null || _a === void 0 ? void 0 : _a.object) === component.object3d) {
                    Game.renderer.domElement.style.cursor = (_b = component.entity.cursor) !== null && _b !== void 0 ? _b : 'default';
                    component.hovered(event);
                }
                else {
                    component.unhovered(event);
                }
            }
        };
        this._onContextMenu = (event) => {
            if (!this._active)
                return;
            const intersections = this._getIntersections(event);
            if (intersections.length > 0) {
                const component = this._components.find(comp => comp.object3d === intersections[0].object);
                component === null || component === void 0 ? void 0 : component.rightClicked(event, intersections[0]);
            }
            //this._mouseHeld = true;
            event.stopPropagation();
        };
        this._onMouseDown = (event) => {
            if (!this._active)
                return;
            if (event.button !== 0)
                return;
            const intersections = this._getIntersections(event);
            if (intersections.length > 0) {
                const component = this._components.find(comp => comp.object3d === intersections[0].object);
                component === null || component === void 0 ? void 0 : component.dragStart(event, intersections[0]);
                this._draggedObject = component;
            }
            this._mouseHeld = true;
            event.stopPropagation();
        };
        this._onClick = (event) => {
            if (!this._active)
                return;
            const dragged = this._draggedObject;
            this._draggedObject = null;
            const intersections = this._getIntersections(event);
            if (intersections.length > 0) {
                const component = this._components.find(comp => comp.object3d === intersections[0].object);
                if (component !== dragged)
                    return;
                component === null || component === void 0 ? void 0 : component.clicked(event, intersections[0]);
            }
            event.stopPropagation();
        };
        this._onDblClick = (event) => {
            if (!this._active)
                return;
            const intersections = this._getIntersections(event);
            if (intersections.length > 0) {
                const component = this._components.find(comp => comp.object3d === intersections[0].object);
                component === null || component === void 0 ? void 0 : component.dblclicked(event, intersections[0]);
            }
            event.stopPropagation();
        };
        this._onMouseUp = (event) => {
            if (this._draggedObject) {
                this._draggedObject.dragEnd(event);
            }
            this._mouseHeld = false;
        };
        this.mount = () => {
            setTimeout(() => {
                this.active = true;
            }, 20);
        };
        this.unmount = () => {
            this.active = false;
            this._domElement.style.cursor = 'default';
        };
        this._width = width;
        this._height = height;
        this._camera = camera;
        this._raycaster = new THREE.Raycaster();
        this._components = [];
        this._object3ds = [];
        this._pointer = new THREE.Vector2();
        this._active = true;
        domElement.addEventListener('pointermove', this._onMouseMoved);
        domElement.addEventListener('pointerdown', this._onMouseDown);
        domElement.addEventListener('pointerup', this._onMouseUp);
        domElement.addEventListener('click', this._onClick);
        domElement.addEventListener('dblclick', this._onDblClick);
        domElement.addEventListener('pointerleave', this._onMouseUp);
        domElement.addEventListener('contextmenu', this._onContextMenu);
        this._domElement = domElement;
    }
}
export { MouseInteractionSystem };
