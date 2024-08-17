class MouseInteractionComponent extends EventTarget {
    _entity;
    _object3d;
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
    hovered = (event) => {
        if (this._entity.hovered)
            return;
        this._entity.hovered = true;
        this.dispatchEvent(new CustomEvent('hover'));
        return true;
    };
    unhovered = (event) => {
        if (!this._entity.hovered)
            return;
        this._entity.hovered = false;
        this.dispatchEvent(new CustomEvent('leave'));
        return true;
    };
    draggedOnto = (event) => {
        if (this._entity.hovered)
            return;
        this._entity.hovered = true;
        this.dispatchEvent(new CustomEvent('draggedOnto', { detail: {
                originalEvent: event,
            } }));
        return true;
    };
    clicked = (event, intersection) => {
        this.dispatchEvent(new CustomEvent('click', { detail: {
                x: event.offsetX,
                y: event.offsetY,
                intersection: intersection,
                originalEvent: event,
            } }));
        return true;
    };
    rightClicked = (event, intersection) => {
        this.dispatchEvent(new CustomEvent('rightclick', { detail: {
                x: event.offsetX,
                y: event.offsetY,
                intersection: intersection,
                originalEvent: event,
            } }));
        return true;
    };
    dblclicked = (event, intersection) => {
        this.dispatchEvent(new CustomEvent('dblclick', { detail: {
                x: event.offsetX,
                y: event.offsetY,
                intersection: intersection,
                originalEvent: event,
            } }));
        return true;
    };
    dragged = (event, intersection) => {
        this.dispatchEvent(new CustomEvent('dragmove', { detail: {
                x: event.offsetX,
                y: event.offsetY,
                intersection: intersection,
                isPrimary: event.isPrimary,
                originalEvent: event,
            } }));
        return true;
    };
    dragStart = (event, intersection) => {
        this.dispatchEvent(new CustomEvent('dragstart', { detail: {
                x: event.offsetX,
                y: event.offsetY,
                intersection: intersection,
                isPrimary: event.isPrimary,
                originalEvent: event,
            } }));
        return true;
    };
    dragEnd = (event, intersection) => {
        this.dispatchEvent(new CustomEvent('dragend', { detail: {
                x: event.offsetX,
                y: event.offsetY,
                intersection: intersection,
                isPrimary: event.isPrimary,
                originalEvent: event,
            } }));
        return true;
    };
}
export { MouseInteractionComponent };
