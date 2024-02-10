class MouseInteractionComponent extends EventTarget {
    get entity() {
        return this._entity;
    }
    get object3d() {
        return this._object3d;
    }
    constructor(entity, object3d) {
        super();
        this.hovered = (event) => {
            if (this._entity.hovered)
                return;
            this._entity.hovered = true;
            this.dispatchEvent(new CustomEvent('hover'));
            return true;
        };
        this.unhovered = (event) => {
            if (!this._entity.hovered)
                return;
            this._entity.hovered = false;
            this.dispatchEvent(new CustomEvent('leave'));
            return true;
        };
        this.clicked = (event, intersection) => {
            this.dispatchEvent(new CustomEvent('click', { detail: {
                    x: event.offsetX,
                    y: event.offsetY,
                    intersection: intersection,
                    originalEvent: event,
                } }));
            return true;
        };
        this.rightClicked = (event, intersection) => {
            this.dispatchEvent(new CustomEvent('rightclick', { detail: {
                    x: event.offsetX,
                    y: event.offsetY,
                    intersection: intersection,
                    originalEvent: event,
                } }));
            return true;
        };
        this.dblclicked = (event, intersection) => {
            this.dispatchEvent(new CustomEvent('dblclick', { detail: {
                    x: event.offsetX,
                    y: event.offsetY,
                    intersection: intersection,
                    originalEvent: event,
                } }));
            return true;
        };
        this.dragged = (event, intersection) => {
            this.dispatchEvent(new CustomEvent('dragmove', { detail: {
                    x: event.offsetX,
                    y: event.offsetY,
                    intersection: intersection,
                    isPrimary: event.isPrimary,
                    originalEvent: event,
                } }));
            return true;
        };
        this.dragStart = (event, intersection) => {
            this.dispatchEvent(new CustomEvent('dragstart', { detail: {
                    x: event.offsetX,
                    y: event.offsetY,
                    intersection: intersection,
                    isPrimary: event.isPrimary,
                    originalEvent: event,
                } }));
            return true;
        };
        this.dragEnd = (event, intersection) => {
            this.dispatchEvent(new CustomEvent('dragend', { detail: {
                    x: event.offsetX,
                    y: event.offsetY,
                    intersection: intersection,
                    isPrimary: event.isPrimary,
                    originalEvent: event,
                } }));
            return true;
        };
        this._entity = entity;
        this._object3d = object3d;
    }
}
export { MouseInteractionComponent };
