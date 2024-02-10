import { MouseInteractionComponent } from "./mouse-interaction-component.js";
import { Sprite2D } from "../graphics/utility/sprite-2d.js";
declare class Draggable extends EventTarget {
    private _minX;
    private _minY;
    private _maxX;
    private _maxY;
    private _offsetX;
    private _offsetY;
    private _sprite;
    private _entity;
    private _component;
    get component(): MouseInteractionComponent;
    constructor(sprite: Sprite2D, boundingRect: Rectangle, entity: any);
}
type Rectangle = {
    x: number;
    y: number;
    w: number;
    h: number;
};
export { Draggable, Rectangle };
