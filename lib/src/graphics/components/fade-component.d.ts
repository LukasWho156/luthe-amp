export default FadeComponent;
declare class FadeComponent {
    constructor(sprite: any, entity: any);
    _sprite: any;
    _entity: any;
    _timer: number;
    _fromOpacity: any;
    _toOpacity: any;
    _totalTime: number;
    _activate(): void;
    _skip(): void;
    update(delta: any): void;
}
