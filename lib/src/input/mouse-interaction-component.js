class MouseInteractionComponent extends EventTarget {
    get entity() {
        return this._entity;
    }
    get object3d() {
        return this._object3d;
    }
    constructor(entity, object3d) {
        super();
        this._entity = entity;
        this._object3d = object3d;
    }
    hovered(event) {
        if (this._entity.hovered)
            return;
        this._entity.hovered = true;
        this.dispatchEvent(new CustomEvent('hover'));
        return true;
    }
    unhovered(event) {
        if (!this._entity.hovered)
            return;
        this._entity.hovered = false;
        this.dispatchEvent(new CustomEvent('leave'));
        return true;
    }
    clicked(event) {
        this.dispatchEvent(new CustomEvent('click'));
        return true;
    }
    dblclicked(event) {
        this.dispatchEvent(new CustomEvent('dblclick'));
        return true;
    }
    dragged(event) {
        this.dispatchEvent(new CustomEvent('dragmove', { detail: {
                x: event.offsetX,
                y: event.offsetY,
            } }));
        return true;
    }
    dragStart(event) {
        this.dispatchEvent(new CustomEvent('dragstart', { detail: {
                x: event.offsetX,
                y: event.offsetY,
            } }));
        return true;
    }
    dragEnd(event) {
        this.dispatchEvent(new CustomEvent('dragend', { detail: {
                x: event.offsetX,
                y: event.offsetY,
            } }));
        return true;
    }
}
export { MouseInteractionComponent };
