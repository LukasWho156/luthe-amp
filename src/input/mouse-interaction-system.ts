import * as THREE from 'three';
import { Game } from '../core/game.js';
import { System } from '../interfaces/system.js';
import { MouseInteractionComponent } from './mouse-interaction-component.js';

class MouseInteractionSystem implements System {

    private _width;
    private _height;
    private _camera;
    private _raycaster;

    private _components: MouseInteractionComponent[];
    private _object3ds: THREE.Object3D[];
    private _pointer;

    private _mouseHeld?: boolean;
    private _draggedObject?: MouseInteractionComponent | null;

    private _active;
    private _domElement;

    get active() {
        return this._active;
    }

    set active(value) {
        for(const component of this._components) {
            component.unhovered();
        }
        this._active = value;
    }

    get mouseHeld() {
        return this._mouseHeld;
    }

    constructor(width: number, height: number, camera: THREE.Camera, domElement: HTMLElement) {
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

    add = (component: MouseInteractionComponent) => {
        this._components.push(component);
        this._object3ds.push(component.object3d);
    }

    private _getIntersections = (event: MouseEvent) => {
        this._raycaster.layers = this._camera.layers;
        this._pointer.x = (event.offsetX / this._width) * 2 - 1;
        this._pointer.y = -(event.offsetY / this._height) * 2 + 1;
        this._raycaster.setFromCamera(this._pointer, this._camera);
        const intersections = this._raycaster.intersectObjects(this._object3ds, false).filter(inter => {
            if(typeof(inter.object.userData.customCollider) !== 'function') {
                return true;
            }
            return inter.object.userData.customCollider(inter.uv?.x, inter.uv?.y);
        });
        return intersections;
    }

    private _onMouseMoved = (event: PointerEvent) => {
        if(!this._active) return;
        Game.renderer.domElement.style.cursor = 'default';
        const intersections = this._getIntersections(event);
        if(this._mouseHeld) {
            if(this._draggedObject) {
                const intersection = intersections.find(i => i.object === this._draggedObject?.object3d);
                this._draggedObject.dragged(event, intersection);
            }
            return;
        }
        for(const component of this._components) {
            if(intersections[0]?.object === component.object3d) {
                Game.renderer.domElement.style.cursor = component.entity.cursor ?? 'default';
                component.hovered(event);
            } else {
                component.unhovered(event);
            }
        }
    }

    private _onContextMenu = (event: MouseEvent) => {
        if(!this._active) return;
        const intersections = this._getIntersections(event);
        if(intersections.length > 0) {
            const component = this._components.find(comp => comp.object3d === intersections[0].object);
            component?.rightClicked(event, intersections[0]);
        }
        //this._mouseHeld = true;
        event.stopPropagation();
    }

    private _onMouseDown = (event: PointerEvent) => {
        if(!this._active) return;
        if(event.button !== 0) return;
        const intersections = this._getIntersections(event);
        if(intersections.length > 0) {
            const component = this._components.find(comp => comp.object3d === intersections[0].object);
            component?.dragStart(event, intersections[0]);
            this._draggedObject = component;
        }
        this._mouseHeld = true;
        event.stopPropagation();
    }

    private _onClick = (event: MouseEvent) => {
        if(!this._active) return;
        const dragged = this._draggedObject;
        this._draggedObject = null;
        const intersections = this._getIntersections(event);
        if(intersections.length > 0) {
            const component = this._components.find(comp => comp.object3d === intersections[0].object);
            if(component !== dragged) return;
            component?.clicked(event, intersections[0]);
        }
        event.stopPropagation();
    }

    private _onDblClick = (event: MouseEvent) => {
        if(!this._active) return;
        const intersections = this._getIntersections(event);
        if(intersections.length > 0) {
            const component = this._components.find(comp => comp.object3d === intersections[0].object);
            component?.dblclicked(event, intersections[0]);
        }
        event.stopPropagation();
    }

    private _onMouseUp = (event: PointerEvent) => {
        if(this._draggedObject) {
            this._draggedObject.dragEnd(event);
        }
        this._mouseHeld = false;
    }

    mount = () => {
        setTimeout(() => {
            this.active = true;
        }, 20);
    }

    unmount = () => {
        this.active = false;
        this._domElement.style.cursor = 'default';
    }

}

export { MouseInteractionSystem };