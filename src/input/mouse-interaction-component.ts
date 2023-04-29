import * as THREE from 'three';

class MouseInteractionComponent extends EventTarget {

    private _entity;
    private _object3d;

    get entity() {
        return this._entity;
    }

    get object3d() {
        return this._object3d;
    }

    constructor(entity: any, object3d: THREE.Object3D) {
        super();
        this._entity = entity;
        this._object3d = object3d;
    }

    hovered = (event: MouseEvent) => {
        if(this._entity.hovered) return;
        this._entity.hovered = true;
        this.dispatchEvent(new CustomEvent('hover'));
        return true;
    }

    unhovered = (event?: MouseEvent) => {
        if(!this._entity.hovered) return;
        this._entity.hovered = false;
        this.dispatchEvent(new CustomEvent('leave'));
        return true;
    }

    clicked = (event: MouseEvent) => {
        this.dispatchEvent(new CustomEvent('click'));
        return true;
    }

    dblclicked = (event: MouseEvent) => {
        this.dispatchEvent(new CustomEvent('dblclick'));
        return true;
    }

    dragged = (event: MouseEvent, intersection?: THREE.Intersection) => {
        this.dispatchEvent(new CustomEvent('dragmove', {detail: {
            x: event.offsetX,
            y: event.offsetY,
            intersection: intersection,
        }}));
        return true;
    }

    dragStart = (event: MouseEvent, intersection?: THREE.Intersection) => {
        this.dispatchEvent(new CustomEvent('dragstart', {detail: {
            x: event.offsetX,
            y: event.offsetY,
            intersection: intersection,
        }}));
        return true;
    }

    dragEnd = (event: MouseEvent) => {
        this.dispatchEvent(new CustomEvent('dragend', {detail: {
            x: event.offsetX,
            y: event.offsetY,
        }}));
        return true;
    }

}

export { MouseInteractionComponent };