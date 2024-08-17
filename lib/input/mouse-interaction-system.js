import * as THREE from 'three';
import { Game } from '../core/game.js';
class MouseInteractionSystem {
    _width;
    _height;
    _camera;
    _raycaster;
    _components;
    _object3ds;
    _pointer;
    _mouseHeld;
    _draggedObject;
    _active;
    _domElement;
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
    add = (component) => {
        this._components.push(component);
        this._object3ds.push(component.object3d);
    };
    _getIntersections = (event) => {
        this._raycaster.layers = this._camera.layers;
        this._pointer.x = (event.offsetX / this._width) * 2 - 1;
        this._pointer.y = -(event.offsetY / this._height) * 2 + 1;
        this._raycaster.setFromCamera(this._pointer, this._camera);
        const intersections = this._raycaster.intersectObjects(this._object3ds, false).filter(inter => {
            if (typeof (inter.object.userData.customCollider) !== 'function') {
                return true;
            }
            return inter.object.userData.customCollider(inter.uv?.x, inter.uv?.y);
        });
        return intersections;
    };
    _onMouseMoved = (event) => {
        if (!this._active)
            return;
        Game.renderer.domElement.style.cursor = 'default';
        const intersections = this._getIntersections(event);
        if (this._mouseHeld) {
            if (this._draggedObject) {
                const intersection = intersections.find(i => i.object === this._draggedObject?.object3d);
                this._draggedObject.dragged(event, intersection);
            }
            for (const component of this._components) {
                if (intersections.find(i => i.object === component.object3d)) {
                    component.draggedOnto(event);
                }
            }
            return;
        }
        for (const component of this._components) {
            if (intersections[0]?.object === component.object3d) {
                Game.renderer.domElement.style.cursor = component.entity.cursor ?? 'default';
                component.hovered(event);
            }
            else {
                component.unhovered(event);
            }
        }
    };
    _onContextMenu = (event) => {
        if (!this._active)
            return;
        const intersections = this._getIntersections(event);
        if (intersections.length > 0) {
            const component = this._components.find(comp => comp.object3d === intersections[0].object);
            component?.rightClicked(event, intersections[0]);
        }
        //this._mouseHeld = true;
        event.stopPropagation();
    };
    _onMouseDown = (event) => {
        if (!this._active)
            return;
        if (event.button !== 0)
            return;
        const intersections = this._getIntersections(event);
        if (intersections.length > 0) {
            const component = this._components.find(comp => comp.object3d === intersections[0].object);
            component?.dragStart(event, intersections[0]);
            this._draggedObject = component;
        }
        this._mouseHeld = true;
        event.stopPropagation();
    };
    _onClick = (event) => {
        if (!this._active)
            return;
        const dragged = this._draggedObject;
        this._draggedObject = null;
        const intersections = this._getIntersections(event);
        if (intersections.length > 0) {
            const component = this._components.find(comp => comp.object3d === intersections[0].object);
            if (component !== dragged)
                return;
            component?.clicked(event, intersections[0]);
        }
        event.stopPropagation();
    };
    _onDblClick = (event) => {
        if (!this._active)
            return;
        const intersections = this._getIntersections(event);
        if (intersections.length > 0) {
            const component = this._components.find(comp => comp.object3d === intersections[0].object);
            component?.dblclicked(event, intersections[0]);
        }
        event.stopPropagation();
    };
    _onMouseUp = (event) => {
        if (this._draggedObject) {
            this._draggedObject.dragEnd(event);
        }
        this._mouseHeld = false;
    };
    mount = () => {
        setTimeout(() => {
            this.active = true;
        }, 20);
    };
    unmount = () => {
        this.active = false;
        this._domElement.style.cursor = 'default';
    };
}
export { MouseInteractionSystem };
