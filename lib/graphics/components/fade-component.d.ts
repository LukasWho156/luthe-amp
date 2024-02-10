import { Sprite2D } from "../utility/sprite-2d.js";
declare class FadeComponent {
    _sprite: Sprite2D;
    _entity: any;
    _totalTime: number;
    _timer: number;
    _fromOpacity: number;
    _toOpacity: number;
    constructor(sprite: Sprite2D, entity: any);
    _activate(): void;
    _skip(): void;
    update(delta: number): void;
}
export { FadeComponent };
