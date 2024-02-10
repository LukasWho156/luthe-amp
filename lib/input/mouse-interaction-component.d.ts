import * as THREE from 'three';
declare class MouseInteractionComponent extends EventTarget {
    private _entity;
    private _object3d;
    get entity(): any;
    get object3d(): THREE.Object3D<THREE.Event>;
    constructor(entity: any, object3d: THREE.Object3D);
    hovered: (event: PointerEvent) => true | undefined;
    unhovered: (event?: PointerEvent) => true | undefined;
    clicked: (event: MouseEvent, intersection: THREE.Intersection) => boolean;
    rightClicked: (event: MouseEvent, intersection: THREE.Intersection) => boolean;
    dblclicked: (event: MouseEvent, intersection: THREE.Intersection) => boolean;
    dragged: (event: PointerEvent, intersection?: THREE.Intersection) => boolean;
    dragStart: (event: PointerEvent, intersection?: THREE.Intersection) => boolean;
    dragEnd: (event: PointerEvent, intersection?: THREE.Intersection) => boolean;
}
export { MouseInteractionComponent };
