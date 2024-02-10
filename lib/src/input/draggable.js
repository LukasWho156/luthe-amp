import { MouseInteractionComponent } from "./mouse-interaction-component.js";
class Draggable extends EventTarget {
    get component() {
        return this._component;
    }
    constructor(sprite, boundingRect, entity) {
        super();
        this._sprite = sprite;
        this._minX = boundingRect.x;
        this._minY = boundingRect.y;
        this._maxX = boundingRect.x + boundingRect.w;
        this._maxY = boundingRect.y + boundingRect.h;
        this._offsetX = 0;
        this._offsetY = 0;
        this._entity = Object.assign(Object.assign({}, entity), { x: sprite.position.x, y: -sprite.position.y, z: sprite.position.z });
        this._component = new MouseInteractionComponent(this._entity, this._sprite);
        this._component.addEventListener('dragstart', (event) => {
            const cEvent = event;
            this._offsetX = cEvent.detail.x - this._entity.x;
            this._offsetY = cEvent.detail.y - this._entity.y;
            this.dispatchEvent(new CustomEvent('dragstart', { detail: {
                    x: this._entity.x,
                    y: this._entity.y,
                } }));
        });
        this._component.addEventListener('dragmove', (event) => {
            const cEvent = event;
            this._entity.x = Math.max(this._minX, Math.min(this._maxX, cEvent.detail.x - this._offsetX));
            this._entity.y = Math.max(this._minY, Math.min(this._maxY, cEvent.detail.y - this._offsetY));
            this._sprite.setPosition(this._entity.x, this._entity.y, this._entity.z);
            this.dispatchEvent(new CustomEvent('dragmove', { detail: {
                    x: this._entity.x,
                    y: this._entity.y,
                } }));
        });
        this._component.addEventListener('dragend', (event) => {
            this.dispatchEvent(new CustomEvent('dragend', { detail: {
                    x: this._entity.x,
                    y: this._entity.y,
                } }));
        });
    }
}
export { Draggable };
